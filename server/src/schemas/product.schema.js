import { z } from 'zod'

const CONDITIONS = ['new', 'like_new', 'good', 'fair', 'poor']

export const createProductSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Product name is required')
    .max(150, 'Title must be 150 characters or fewer'),
  description: z
    .string()
    .trim()
    .max(5000)
    .default(''),
  price: z
    .number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative'),
  originalPrice: z.number().min(0).optional().nullable(),
  // category is now a MongoDB ObjectId string pointing to admin-created Category
  category: z
    .string({ required_error: 'Category is required' })
    .min(1, 'Category is required'),
  condition: z.enum(CONDITIONS).default('new'),
  stock: z
    .number({ required_error: 'Stock is required', invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  status: z.enum(['published', 'draft']).default('published'),
  tags: z.array(z.string().trim().max(30)).max(10).default([]),
})

export const updateProductSchema = createProductSchema.partial()

export const productQuerySchema = z.object({
  page:      z.coerce.number().int().min(1).default(1),
  limit:     z.coerce.number().int().min(1).max(100).default(20),
  category:  z.string().optional(),   // ObjectId string
  condition: z.enum(CONDITIONS).optional(),
  minPrice:  z.coerce.number().min(0).optional(),
  maxPrice:  z.coerce.number().min(0).optional(),
  sort:      z.enum(['newest', 'price_asc', 'price_desc', 'rating']).default('newest'),
  status:    z.enum(['published', 'draft', 'inactive']).optional(),
  q:         z.string().trim().optional(),
})
