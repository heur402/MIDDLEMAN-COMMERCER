import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { paginate } from '../utils/paginate.js'
import { notifyOrderStatus } from '../services/notification.service.js'

// ── POST /api/orders ──────────────────────────────────────────────────────────
export const placeOrders = asyncHandler(async (req, res) => {
  const { orders: orderPayloads } = req.body
  const buyerId = req.user.userId

  const created = []

  for (const payload of orderPayloads) {
    const { sellerId, items, shippingAddress, totalAmount } = payload

    // Validate stock for every item
    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) throw ApiError.notFound(`Product ${item.productId} not found`)
      if (product.status !== 'published') throw ApiError.badRequest(`Product "${product.title}" is not available`)
      if (product.stock < item.qty) {
        throw ApiError.unprocessable(`Not enough stock for "${product.title}" (available: ${product.stock})`)
      }
    }

    // Build item snapshots
    const snapshotItems = await Promise.all(
      items.map(async (item) => {
        const p = await Product.findById(item.productId).lean()
        return {
          productId: p._id,
          sellerId:  p.sellerId,
          title:     p.title,
          price:     item.price,
          image:     p.images?.[0] ?? null,
          qty:       item.qty,
        }
      })
    )

    // Create order
    const order = await Order.create({
      buyerId,
      sellerId,
      items: snapshotItems,
      shippingAddress,
      totalAmount,
      paymentStatus: 'unpaid',
      timeline: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }],
    })

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty },
        $set: { updatedAt: new Date() },
      })
      // Set out_of_stock if stock reaches 0
      const updated = await Product.findById(item.productId)
      if (updated && updated.stock === 0) {
        await Product.findByIdAndUpdate(item.productId, { status: 'inactive' })
      }
    }

    created.push(order)
    notifyOrderStatus(order, 'pending')
  }

  res.status(201).json({ success: true, data: created })
})

// ── GET /api/orders ───────────────────────────────────────────────────────────
export const getBuyerOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query
  const filter = { buyerId: req.user.userId }
  if (status) filter.status = status

  const result = await paginate(Order, filter, {
    page, limit,
    sort: { createdAt: -1 },
  })
  res.json({ success: true, ...result })
})

// ── GET /api/orders/:id ───────────────────────────────────────────────────────
export const getBuyerOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, buyerId: req.user.userId })
  if (!order) throw ApiError.notFound('Order not found')
  res.json({ success: true, data: order })
})

// ── PATCH /api/orders/:id/deliver ─────────────────────────────────────────────
export const markDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, buyerId: req.user.userId })
  if (!order) throw ApiError.notFound('Order not found')
  if (order.status !== 'shipped') {
    throw ApiError.badRequest('Order must be in shipped status to mark as delivered')
  }

  order.status = 'delivered'
  order.timeline.push({ status: 'delivered', timestamp: new Date(), note: 'Buyer confirmed delivery' })
  await order.save()

  notifyOrderStatus(order, 'delivered')
  res.json({ success: true, data: order })
})
