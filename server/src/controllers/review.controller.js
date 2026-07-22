import { Review } from '../models/Review.js'
import { Order } from '../models/Order.js'
import { User } from '../models/User.js'
import { Product } from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { paginate } from '../utils/paginate.js'

// ── POST /api/reviews ─────────────────────────────────────────────────────────
export const createReview = asyncHandler(async (req, res) => {
  const { orderId, productId, rating, comment } = req.body
  const reviewerId = req.user.userId

  // Order must belong to buyer and be completed
  const order = await Order.findOne({ _id: orderId, buyerId: reviewerId })
  if (!order) throw ApiError.notFound('Order not found')
  if (order.status !== 'completed') throw ApiError.badRequest('Can only review completed orders')

  // One review per order
  const existing = await Review.findOne({ orderId })
  if (existing) throw ApiError.conflict('You have already reviewed this order')

  const review = await Review.create({
    orderId,
    reviewerId,
    revieweeId: order.sellerId,
    productId,
    rating,
    comment,
  })

  // Update seller aggregate rating
  const stats = await Review.aggregate([
    { $match: { revieweeId: order.sellerId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  if (stats.length) {
    await User.findByIdAndUpdate(order.sellerId, {
      rating: Math.round(stats[0].avg * 10) / 10,
      reviewCount: stats[0].count,
    })
  }

  // Update product aggregate rating
  const productStats = await Review.aggregate([
    { $match: { productId: review.productId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  if (productStats.length) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(productStats[0].avg * 10) / 10,
      reviewCount: productStats[0].count,
    })
  }

  // Advance order to completed if not already
  if (order.status !== 'completed') {
    order.status = 'completed'
    order.timeline.push({ status: 'completed', timestamp: new Date(), note: 'Review submitted' })
    await order.save()
  }

  res.status(201).json({ success: true, data: review })
})

// ── GET /api/reviews/seller/:sellerId ─────────────────────────────────────────
export const getSellerReviews = asyncHandler(async (req, res) => {
  const { page, limit } = req.query

  const result = await paginate(Review, { revieweeId: req.params.sellerId }, {
    page, limit,
    sort: { createdAt: -1 },
    populate: { path: 'reviewerId', select: 'name avatar' },
  })

  res.json({ success: true, ...result })
})

// ── GET /api/reviews/product/:productId ───────────────────────────────────────
export const getProductReviews = asyncHandler(async (req, res) => {
  const { page, limit } = req.query

  const result = await paginate(Review, { productId: req.params.productId }, {
    page, limit,
    sort: { createdAt: -1 },
    populate: { path: 'reviewerId', select: 'name avatar' },
  })

  res.json({ success: true, ...result })
})
