import { z } from 'zod'

export const startConversationSchema = z.object({
  recipientId: z.string().min(1, 'recipientId is required'),
  orderId:     z.string().optional(),
})

export const sendMessageSchema = z.object({
  text: z
    .string({ required_error: 'Message text is required' })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be 2000 characters or fewer'),
})
