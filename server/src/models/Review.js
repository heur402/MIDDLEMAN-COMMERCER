import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    orderId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Order',   required: true, unique: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    productId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating:     { type: Number, required: true, min: 1, max: 5 },
    comment:    { type: String, maxlength: 1000, default: '' },
  },
  { timestamps: true }
)

// ── Indexes ───────────────────────────────────────────────────────────────────
reviewSchema.index({ revieweeId: 1, createdAt: -1 })
reviewSchema.index({ productId: 1, createdAt: -1 })

export const Review = mongoose.model('Review', reviewSchema)
