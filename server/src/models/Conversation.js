import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    senderId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text:        { type: String, maxlength: 2000, default: '' },
    attachments: { type: [String], default: [] },   // Cloudinary / local URLs
    readBy:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

const conversationSchema = new mongoose.Schema(
  {
    participants:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   // exactly 2
    orderId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    messages:      { type: [messageSchema], default: [] },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// ── Indexes ───────────────────────────────────────────────────────────────────
conversationSchema.index({ participants: 1 })
conversationSchema.index({ orderId: 1 })
conversationSchema.index({ lastMessageAt: -1 })

export const Conversation = mongoose.model('Conversation', conversationSchema)
