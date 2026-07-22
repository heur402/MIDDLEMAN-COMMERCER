import { User } from '../models/User.js'
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import { Dispute } from '../models/Dispute.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { paginate } from '../utils/paginate.js'

// ── GET /api/admin/users ──────────────────────────────────────────────────────
export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, q } = req.query
  const filter = {}
  if (q) filter.$or = [
    { name:  { $regex: q, $options: 'i' } },
    { email: { $regex: q, $options: 'i' } },
  ]

  const result = await paginate(User, filter, {
    page, limit,
    sort: { createdAt: -1 },
    select: '-passwordHash',
  })
  res.json({ success: true, ...result })
})

// ── GET /api/admin/users/:id ──────────────────────────────────────────────────
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash')
  if (!user) throw ApiError.notFound('User not found')
  res.json({ success: true, data: user })
})

// ── PATCH /api/admin/users/:id/ban ────────────────────────────────────────────
export const banUser = asyncHandler(async (req, res) => {
  const { banned, reason } = req.body
  const user = await User.findById(req.params.id)
  if (!user) throw ApiError.notFound('User not found')
  if (user.roles.includes('admin')) throw ApiError.forbidden('Cannot ban an admin')

  user.isBanned = !!banned
  await user.save()

  console.log(`[ADMIN] User ${user._id} ${banned ? 'banned' : 'unbanned'}. Reason: ${reason ?? 'none'}`)
  res.json({ success: true, data: { _id: user._id, isBanned: user.isBanned } })
})

// ── GET /api/admin/listings ───────────────────────────────────────────────────
export const listAllListings = asyncHandler(async (req, res) => {
  const { page, limit, status, q } = req.query
  const filter = {}
  if (status) filter.status = status
  if (q) filter.$text = { $search: q }

  const result = await paginate(Product, filter, {
    page, limit,
    sort: { createdAt: -1 },
    populate: { path: 'sellerId', select: 'name email' },
  })
  res.json({ success: true, ...result })
})

// ── PATCH /api/admin/listings/:id/deactivate ─────────────────────────────────
export const deactivateListing = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw ApiError.notFound('Listing not found')

  product.status = 'inactive'
  await product.save()
  res.json({ success: true, data: product })
})

// ── GET /api/admin/disputes ───────────────────────────────────────────────────
export const listAllDisputes = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query
  const filter = {}
  if (status) filter.status = status

  const result = await paginate(Dispute, filter, {
    page, limit,
    sort: { createdAt: -1 },
    populate: [
      { path: 'raisedBy', select: 'name email' },
      { path: 'orderId',  select: 'totalAmount status' },
    ],
  })
  res.json({ success: true, ...result })
})

// ── PATCH /api/admin/disputes/:id ────────────────────────────────────────────
export const updateDispute = asyncHandler(async (req, res) => {
  const { status, resolution, adminNotes } = req.body
  const dispute = await Dispute.findById(req.params.id)
  if (!dispute) throw ApiError.notFound('Dispute not found')

  if (status)     dispute.status     = status
  if (resolution) dispute.resolution = resolution
  if (adminNotes) dispute.adminNotes = adminNotes
  if (status === 'resolved') dispute.resolvedAt = new Date()

  await dispute.save()
  res.json({ success: true, data: dispute })
})

// ── GET /api/admin/analytics ──────────────────────────────────────────────────
export const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalOrders,
    openDisputes,
    gmvResult,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isBanned: false }),
    Order.countDocuments(),
    Dispute.countDocuments({ status: 'open' }),
    Order.aggregate([
      { $match: { status: { $in: ['completed', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ])

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      totalOrders,
      openDisputes,
      gmv: gmvResult[0]?.total ?? 0,
    },
  })
})
