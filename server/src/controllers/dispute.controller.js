import { Dispute } from '../models/Dispute.js'
import { Order } from '../models/Order.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { paginate } from '../utils/paginate.js'
import { uploadFiles } from '../services/upload.service.js'
import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'

// ── POST /api/disputes ────────────────────────────────────────────────────────
export const raiseDispute = asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body
  const userId = req.user.userId

  // Order must belong to buyer or seller
  const order = await Order.findById(orderId)
  if (!order) throw ApiError.notFound('Order not found')

  const isBuyer  = order.buyerId?.toString()  === userId
  const isSeller = order.sellerId?.toString() === userId
  if (!isBuyer && !isSeller) throw ApiError.forbidden('Not your order')

  // Only one dispute per order
  const existing = await Dispute.findOne({ orderId })
  if (existing) throw ApiError.conflict('A dispute already exists for this order')

  // Cannot dispute completed/cancelled orders
  if (['completed', 'cancelled'].includes(order.status)) {
    throw ApiError.badRequest('Cannot dispute a completed or cancelled order')
  }

  const dispute = await Dispute.create({ orderId, raisedBy: userId, reason })
  order.timeline.push({ status: order.status, note: 'Dispute opened; order actions paused.' })
  await order.save()

  const recipients = [order.buyerId, order.sellerId]
    .filter(Boolean)
    .filter((id) => id.toString() !== userId)
  const admins = await User.find({ roles: 'admin' }).select('_id').lean()
  await Notification.insertMany([
    ...recipients.map((recipient) => ({
      userId: recipient,
      type: 'dispute:opened',
      title: 'Dispute opened',
      message: `A dispute was opened for order #${order._id.toString().slice(-8).toUpperCase()}.`,
      data: { disputeId: dispute._id, orderId: order._id },
    })),
    ...admins.map((admin) => ({
      userId: admin._id,
      type: 'dispute:opened',
      title: 'New dispute requires review',
      message: `A dispute was opened for order #${order._id.toString().slice(-8).toUpperCase()}.`,
      data: { disputeId: dispute._id, orderId: order._id },
    })),
  ])
  res.status(201).json({ success: true, data: dispute })
})

// ── GET /api/disputes ─────────────────────────────────────────────────────────
export const getMyDisputes = asyncHandler(async (req, res) => {
  const { page, limit } = req.query

  const orders = await Order.find({
    $or: [{ buyerId: req.user.userId }, { sellerId: req.user.userId }],
  }).select('_id').lean()
  const result = await paginate(Dispute, {
    $or: [{ raisedBy: req.user.userId }, { orderId: { $in: orders.map((order) => order._id) } }],
  }, {
    page, limit,
    sort: { createdAt: -1 },
  })
  res.json({ success: true, ...result })
})

// ── GET /api/disputes/:id ─────────────────────────────────────────────────────
export const getDispute = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findById(req.params.id).populate('orderId')

  if (!dispute) throw ApiError.notFound('Dispute not found')
  const order = dispute.orderId
  if (order.buyerId?.toString() !== req.user.userId && order.sellerId?.toString() !== req.user.userId) {
    throw ApiError.forbidden('You cannot view this dispute')
  }
  res.json({ success: true, data: dispute })
})

// GET /api/disputes/order/:orderId
export const getDisputeByOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).select('buyerId sellerId')
  if (!order) throw ApiError.notFound('Order not found')
  if (order.buyerId?.toString() !== req.user.userId && order.sellerId?.toString() !== req.user.userId) {
    throw ApiError.forbidden('Not your order')
  }
  const dispute = await Dispute.findOne({ orderId: order._id }).populate('orderId')
  res.json({ success: true, data: dispute })
})

// ── POST /api/disputes/:id/evidence ──────────────────────────────────────────
export const addEvidence = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findById(req.params.id).populate('orderId')
  if (!dispute) throw ApiError.notFound('Dispute not found')
  if (dispute.orderId.buyerId?.toString() !== req.user.userId && dispute.orderId.sellerId?.toString() !== req.user.userId) {
    throw ApiError.forbidden('You cannot update this dispute')
  }
  if (dispute.status === 'resolved' || dispute.status === 'closed') {
    throw ApiError.badRequest('Cannot add evidence to a closed dispute')
  }

  if (!req.files?.length) throw ApiError.badRequest('No files uploaded')

  const urls = await uploadFiles(req.files, 'evidence')
  dispute.evidence.push(...urls)
  await dispute.save()

  res.json({ success: true, data: dispute })
})
