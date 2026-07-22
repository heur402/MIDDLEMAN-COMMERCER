import { Conversation } from '../models/Conversation.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// ── GET /api/conversations ────────────────────────────────────────────────────
export const listConversations = asyncHandler(async (req, res) => {
  const userId = req.user.userId

  const conversations = await Conversation.find({ participants: userId })
    .sort({ lastMessageAt: -1 })
    .populate('participants', 'name avatar')
    .lean()

  res.json({ success: true, data: conversations })
})

// ── POST /api/conversations ───────────────────────────────────────────────────
export const startConversation = asyncHandler(async (req, res) => {
  const { recipientId, orderId } = req.body
  const userId = req.user.userId

  if (recipientId === userId) throw ApiError.badRequest('Cannot start a conversation with yourself')

  // Check if conversation already exists between these two users (optionally for same order)
  const filter = { participants: { $all: [userId, recipientId] } }
  if (orderId) filter.orderId = orderId

  let conv = await Conversation.findOne(filter).populate('participants', 'name avatar')

  if (!conv) {
    conv = await Conversation.create({
      participants: [userId, recipientId],
      orderId: orderId ?? null,
    })
    conv = await conv.populate('participants', 'name avatar')
  }

  res.status(201).json({ success: true, data: conv })
})

// ── GET /api/conversations/:id ────────────────────────────────────────────────
export const getConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId

  const conv = await Conversation.findOne({
    _id: req.params.id,
    participants: userId,
  }).populate('participants', 'name avatar')

  if (!conv) throw ApiError.notFound('Conversation not found')
  res.json({ success: true, data: conv })
})

// ── POST /api/conversations/:id/messages ──────────────────────────────────────
export const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user.userId
  const { text } = req.body

  if (!text?.trim()) throw ApiError.badRequest('Message text is required')

  const conv = await Conversation.findOne({
    _id: req.params.id,
    participants: userId,
  })
  if (!conv) throw ApiError.notFound('Conversation not found')

  const message = {
    senderId:    userId,
    text:        text.trim(),
    attachments: [],
    readBy:      [userId],
    createdAt:   new Date(),
  }

  conv.messages.push(message)
  conv.lastMessageAt = new Date()
  await conv.save()

  const newMsg = conv.messages[conv.messages.length - 1]

  // Emit real-time event via Socket.IO (attached to app in server.js)
  const io = req.app.get('io')
  if (io) {
    io.to(`conv:${conv._id}`).emit('message:new', {
      conversationId: conv._id,
      message:        newMsg,
    })
  }

  res.status(201).json({ success: true, data: newMsg })
})
