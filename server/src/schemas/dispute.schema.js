import { z } from 'zod'

export const createDisputeSchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  reason:  z
    .string({ required_error: 'Reason is required' })
    .trim()
    .min(20, 'Reason must be at least 20 characters')
    .max(2000, 'Reason must be 2000 characters or fewer'),
})

export const updateDisputeSchema = z.object({
  status:     z.enum(['under_review', 'resolved', 'closed']).optional(),
  resolution: z.string().trim().max(1000).optional(),
  adminNotes: z.string().trim().max(2000).optional(),
})
