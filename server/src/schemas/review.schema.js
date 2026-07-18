import { z } from 'zod'

export const createReviewSchema = z.object({
  orderId:   z.string().min(1, 'orderId is required'),
  productId: z.string().min(1, 'productId is required'),
  rating:    z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment:   z.string().trim().max(1000, 'Comment must be 1000 characters or fewer').optional().default(''),
})
