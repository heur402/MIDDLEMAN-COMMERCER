import mongoose from 'mongoose'

/**
 * In-app notification model.
 * Phase 1: created by notification.service.js stub (console only).
 * Phase 2: this model is persisted and delivered via Socket.IO.
 */
const notificationSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:    { type: String, required: true },      // e.g. 'order:placed'
    title:   { type: String, required: true },
    message: { type: String, default: '' },
    data:    { type: mongoose.Schema.Types.Mixed, default: {} },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
)

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 })

export const Notification = mongoose.model('Notification', notificationSchema)
