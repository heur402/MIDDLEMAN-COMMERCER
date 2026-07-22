import mongoose from 'mongoose'

const timelineEntrySchema = new mongoose.Schema(
  {
    status:    { type: String, required: true },
    note:      { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
)

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    title:     { type: String, required: true },
    price:     { type: Number, required: true },
    image:     { type: String, default: null },
    qty:       { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const shippingAddressSchema = new mongoose.Schema(
  {
    street:  { type: String, default: '' },
    city:    { type: String, default: '' },
    state:   { type: String, default: '' },
    zip:     { type: String, default: '' },
    country: { type: String, default: '' },
  },
  { _id: false }
)

/**
 * Guest buyer info — collected at checkout when no account exists.
 * buyerId is null for guests; guestEmail is used to look up orders.
 */
const guestBuyerSchema = new mongoose.Schema(
  {
    name:  { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    // buyerId is null for guest orders
    buyerId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Guest buyer info — only populated when buyerId is null
    guestBuyer:      { type: guestBuyerSchema, default: null },

    sellerId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items:           { type: [orderItemSchema], required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus:   { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    shippingAddress: { type: shippingAddressSchema, required: true },
    trackingNumber:  { type: String, default: null },
    totalAmount:     { type: Number, required: true },
    timeline:        { type: [timelineEntrySchema], default: [] },
  },
  { timestamps: true }
)

// ── Indexes ───────────────────────────────────────────────────────────────────
orderSchema.index({ buyerId: 1, createdAt: -1 })
orderSchema.index({ sellerId: 1, createdAt: -1 })
orderSchema.index({ 'guestBuyer.email': 1 })
orderSchema.index({ status: 1 })

export const Order = mongoose.model('Order', orderSchema)
