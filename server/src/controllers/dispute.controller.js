import { Dispute } from '../models/Dispute.js'
import { Order } from '../models/Order.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { paginate } from '../utils/paginate.js'
import { uploadFiles } from '../services/upload.service.js'

// ── POST /api/disputes ────────────────────────────────────────────────────────
export const raiseDispute = asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body
  const userId = req.user.userId

  // Order must belong to buyer or seller
  const order = await Order.findById(orderId)
  if (!order) throw ApiError.notFound('Order not found')

  const isBuyer  = order.buyerId.toString()  === userId
  const isSeller = order.sellerId.toString() === userId
  if (!isBuyer && !isSeller) throw ApiError.forbidden('Not your order')

  // Only one dispute per order
  const existing = await Dispute.findOne({ orderId })
  if (existing) throw ApiError.conflict('A dispute already exists for this order')

  // Cannot dispute completed/cancelled orders
  if (['completed', 'cancelled'].includes(order.status)) {
    throw ApiError.badRequest('Cannot dispute a completed or cancelled order')
  }

  const dispute = await Dispute.create({ orderId, raisedBy: userId, reason })
  res.status(201).json({ success: true, data: dispute })
})

// ── GET /api/disputes ─────────────────────────────────────────────────────────
export const getMyDisputes = asyncHandler(async (req, res) => {
  const { page, limit } = req.query

  const result = await paginate(Dispute, { raisedBy: req.user.userId }, {
    page, limit,
    sort: { createdAt: -1 },
  })
  res.json({ success: true, ...result })
})

// ── GET /api/disputes/:id ─────────────────────────────────────────────────────
export const getDispute = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findOne({
    _id: req.params.id,
    raisedBy: req.user.userId,
  }).populate('orderId')

  if (!dispute) throw ApiError.notFound('Dispute not found')
  res.json({ success: true, data: dispute })
})

// ── POST /api/disputes/:id/evidence ──────────────────────────────────────────
export const addEvidence = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findOne({ _id: req.params.id, raisedBy: req.user.userId })
  if (!dispute) throw ApiError.notFound('Dispute not found')
  if (dispute.status === 'resolved' || dispute.status === 'closed') {
    throw ApiError.badRequest('Cannot add evidence to a closed dispute')
  }

  if (!req.files?.length) throw ApiError.badRequest('No files uploaded')

  const urls = await uploadFiles(req.files, 'evidence')
  dispute.evidence.push(...urls)
  await dispute.save()

  res.json({ success: true, data: dispute })
})
