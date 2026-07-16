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
    title:     { type: String, required: true },    // snapshot at purchase time
    price:     { type: Number, required: true },    // snapshot at purchase time
    image:     { type: String, default: null },     // snapshot at purchase time
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

const orderSchema = new mongoose.Schema(
  {
    buyerId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
orderSchema.index({ status: 1 })

export const Order = mongoose.model('Order', orderSchema)
