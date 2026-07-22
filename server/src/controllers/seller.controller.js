import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { paginate } from '../utils/paginate.js'
import { uploadFiles, deleteFile } from '../services/upload.service.js'

// ── GET /api/seller/listings ──────────────────────────────────────────────────
export const getMyListings = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query
  const filter = { sellerId: req.user.userId }
  if (status) filter.status = status

  const result = await paginate(Product, filter, { page, limit, sort: { createdAt: -1 } })
  res.json({ success: true, ...result })
})

// ── POST /api/seller/listings ─────────────────────────────────────────────────
export const createListing = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, sellerId: req.user.userId })
  res.status(201).json({ success: true, data: product })
})

// ── PUT /api/seller/listings/:id ──────────────────────────────────────────────
export const updateListing = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.userId })
  if (!product) throw ApiError.notFound('Listing not found or not yours')
  Object.assign(product, req.body)
  product.updatedAt = new Date()
  await product.save()
  res.json({ success: true, data: product })
})

// ── DELETE /api/seller/listings/:id ──────────────────────────────────────────
export const deleteListing = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.userId })
  if (!product) throw ApiError.notFound('Listing not found or not yours')
  product.status = 'inactive'
  await product.save()
  res.json({ success: true, message: 'Listing deactivated' })
})

// ── POST /api/seller/listings/:id/images ──────────────────────────────────────
export const uploadImages = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.userId })
  if (!product) throw ApiError.notFound('Listing not found or not yours')
  if (!req.files?.length) throw ApiError.badRequest('No images uploaded')

  const remaining = 5 - product.images.length
  if (remaining <= 0) throw ApiError.badRequest('Maximum 5 images per listing')

  const urls = await uploadFiles(req.files.slice(0, remaining), 'products')
  product.images.push(...urls)
  await product.save()
  res.json({ success: true, data: product })
})

// ── DELETE /api/seller/listings/:id/images/:index ────────────────────────────
export const removeImage = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.userId })
  if (!product) throw ApiError.notFound('Listing not found or not yours')

  const idx = Number(req.params.index)
  if (idx < 0 || idx >= product.images.length) throw ApiError.badRequest('Invalid image index')

  const [removed] = product.images.splice(idx, 1)
  await deleteFile(removed)
  await product.save()
  res.json({ success: true, data: product })
})

// ── GET /api/seller/orders ────────────────────────────────────────────────────
export const getSellerOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query
  const filter = { sellerId: req.user.userId }
  if (status) filter.status = status

  const result = await paginate(Order, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: { path: 'buyerId', select: 'name email avatar' },
  })
  res.json({ success: true, ...result })
})

// ── GET /api/seller/orders/:id ────────────────────────────────────────────────
export const getSellerOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, sellerId: req.user.userId })
    .populate('buyerId', 'name email avatar')
  if (!order) throw ApiError.notFound('Order not found')
  res.json({ success: true, data: order })
})

// ── PATCH /api/seller/orders/:id/status ──────────────────────────────────────
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, note } = req.body
  const order = await Order.findOne({ _id: req.params.id, sellerId: req.user.userId })
  if (!order) throw ApiError.notFound('Order not found')

  const VALID_TRANSITIONS = { pending: 'confirmed', confirmed: 'shipped' }
  if (VALID_TRANSITIONS[order.status] !== status) {
    throw ApiError.badRequest(`Cannot transition from ${order.status} to ${status}`)
  }
  if (status === 'shipped' && !trackingNumber) {
    throw ApiError.badRequest('Tracking number is required when shipping')
  }

  order.status = status
  if (trackingNumber) order.trackingNumber = trackingNumber
  order.timeline.push({ status, note: note ?? '', timestamp: new Date() })
  await order.save()

  res.json({ success: true, data: order })
})

// ── GET /api/seller/earnings ──────────────────────────────────────────────────
export const getEarnings = asyncHandler(async (req, res) => {
  const sellerId = req.user.userId

  const [totalOrders, pendingOrders, completedAgg] = await Promise.all([
    Order.countDocuments({ sellerId }),
    Order.countDocuments({ sellerId, status: 'pending' }),
    Order.aggregate([
      { $match: { sellerId: { $toObjectId: sellerId }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ])

  res.json({
    success: true,
    data: {
      totalOrders,
      pendingOrders,
      totalEarnings:   completedAgg[0]?.total ?? 0,
      pendingEarnings: 0, // populated when escrow is implemented
    },
  })
})
