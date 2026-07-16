import mongoose from 'mongoose'

const disputeSchema = new mongoose.Schema(
  {
    orderId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    raisedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
    reason:     { type: String, required: true, maxlength: 2000 },
    evidence:   { type: [String], default: [] },    // Cloudinary / local URLs
    status:     {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'closed'],
      default: 'open',
    },
    resolution:  { type: String, default: null },   // e.g. 'refund_issued'
    adminNotes:  { type: String, default: null },
    resolvedAt:  { type: Date,   default: null },
  },
  { timestamps: true }
)

// ── Indexes ───────────────────────────────────────────────────────────────────
disputeSchema.index({ orderId: 1 })
disputeSchema.index({ raisedBy: 1 })
disputeSchema.index({ status: 1 })

export const Dispute = mongoose.model('Dispute', disputeSchema)
