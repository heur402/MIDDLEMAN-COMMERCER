import mongoose from 'mongoose'
import { Order } from '../models/Order.js'
import { Dispute } from '../models/Dispute.js'
import { Product } from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { paginate } from '../utils/paginate.js'
import { notifyOrderStatus } from '../services/notification.service.js'

// ── POST /api/orders ──────────────────────────────────────────────────────────
function generateOrderRef(id) {
  return id.toString().slice(-10).toUpperCase()
}

export const placeOrders = asyncHandler(async (req, res) => {
  const { orders: orderPayloads, guestBuyer } = req.body
  const buyerId = req.user?.userId ?? null // optional auth

  // Guests must supply contact info
  if (!buyerId && !guestBuyer) {
    throw ApiError.badRequest('Guest buyers must provide name and email to place an order')
  }

  const created = []

  for (const payload of orderPayloads) {
    const { sellerId, items, shippingAddress, totalAmount } = payload

    // Fetch products once — validate stock + build snapshots in one pass
    const productDocs = await Promise.all(
      items.map((item) => Product.findById(item.productId).lean())
    )

    for (let i = 0; i < items.length; i++) {
      const product = productDocs[i]
      const item    = items[i]
      if (!product)                       throw ApiError.notFound(`Product ${item.productId} not found`)
      if (product.status !== 'published') throw ApiError.badRequest(`"${product.title}" is not available`)
      if (product.stock < item.qty) {
        throw ApiError.unprocessable(
          `Not enough stock for "${product.title}" (available: ${product.stock})`
        )
      }
    }

    const snapshotItems = items.map((item, i) => {
      const p = productDocs[i]
      return {
        productId: p._id,
        sellerId:  p.sellerId,
        title:     p.title,
        price:     item.price,
        image:     p.images?.[0] ?? null,
        qty:       item.qty,
      }
    })

    // Create order
    const order = await Order.create({
      orderRef:    generateOrderRef(new mongoose.Types.ObjectId()),
      buyerId:     buyerId,
      guestBuyer:  buyerId ? null : guestBuyer,
      sellerId,
      items:       snapshotItems,
      shippingAddress,
      totalAmount,
      paymentStatus: 'unpaid',
      timeline: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }],
    })

    // Decrement stock; auto-deactivate if it hits 0
    for (let i = 0; i < items.length; i++) {
      const newStock = productDocs[i].stock - items[i].qty
      await Product.findByIdAndUpdate(items[i].productId, {
        $inc: { stock: -items[i].qty },
        ...(newStock === 0 && { $set: { status: 'inactive' } }),
      })
    }

    created.push(order)
    notifyOrderStatus(order, 'pending')
  }

  res.status(201).json({ success: true, data: created })
})

// ── GET /api/orders — authenticated buyers only ───────────────────────────────
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

// ── GET /api/orders/:id — authenticated buyer view ────────────────────────────
export const getBuyerOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, buyerId: req.user.userId })
  if (!order) throw ApiError.notFound('Order not found')
  res.json({ success: true, data: order })
})

// ── GET /api/orders/track — lookup by orderRef ──────────────────────────────
export const trackGuestOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.query
  if (!orderId) throw ApiError.badRequest('orderId is required')

  const order = await Order.findOne({ orderRef: orderId.toUpperCase() })
  if (!order) throw ApiError.notFound('Order not found. Check your Order ID.')

  res.json({ success: true, data: order })
})

// ── PATCH /api/orders/:id/deliver — mark delivered ───────────────────────────
// Can be done by authenticated buyer OR guest (verified by email query param)
export const markDelivered = asyncHandler(async (req, res) => {
  const userId = req.user?.userId

  let order
  if (userId) {
    order = await Order.findOne({ _id: req.params.id, buyerId: userId })
  } else {
    order = await Order.findById(req.params.id)
  }

  if (!order) throw ApiError.notFound('Order not found')
  if (await Dispute.exists({ orderId: order._id, status: { $in: ['open', 'under_review'] } })) {
    throw ApiError.badRequest('Order actions are paused while its dispute is under review')
  }
  if (order.status !== 'shipped') {
    throw ApiError.badRequest('Order must be shipped before marking as delivered')
  }

  order.status = 'delivered'
  order.timeline.push({
    status:    'delivered',
    timestamp: new Date(),
    note:      'Buyer confirmed delivery',
  })
  await order.save()

  notifyOrderStatus(order, 'delivered')
  res.json({ success: true, data: order })
})
