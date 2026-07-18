import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  sellerId:  z.string().min(1, 'sellerId is required'),
  qty:       z.number().int().min(1, 'Quantity must be at least 1'),
  price:     z.number().min(0, 'Price cannot be negative'),
})

const shippingAddressSchema = z.object({
  street:  z.string().trim().min(1, 'Street is required'),
  city:    z.string().trim().min(1, 'City is required'),
  state:   z.string().trim().default(''),
  zip:     z.string().trim().default(''),
  country: z.string().trim().min(1, 'Country is required'),
})

/** Shape of a single sub-order within the checkout payload */
export const singleOrderSchema = z.object({
  sellerId:        z.string().min(1, 'sellerId is required'),
  items:           z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
  totalAmount:     z.number().min(0),
})

/** POST /api/orders — array of sub-orders (one per seller) */
export const placeOrderSchema = z.object({
  orders: z.array(singleOrderSchema).min(1, 'At least one order is required'),
})

/** PATCH /api/seller/orders/:id/status */
export const updateOrderStatusSchema = z.object({
  status:         z.enum(['confirmed', 'shipped', 'cancelled']),
  trackingNumber: z.string().trim().optional(),
  note:           z.string().trim().max(300).optional(),
})

export const orderQuerySchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled']).optional(),
})
