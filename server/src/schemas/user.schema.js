import { z } from 'zod'

export const updateProfileSchema = z.object({
  name:   z.string().trim().min(2).max(60).optional(),
  phone:  z.string().trim().max(20).optional().nullable(),
  avatar: z.string().url('Avatar must be a valid URL').optional().nullable(),
})

export const addAddressSchema = z.object({
  label:     z.string().trim().max(30).default('Home'),
  street:    z.string().trim().min(1, 'Street is required'),
  city:      z.string().trim().min(1, 'City is required'),
  state:     z.string().trim().default(''),
  zip:       z.string().trim().default(''),
  country:   z.string().trim().min(1, 'Country is required'),
  isDefault: z.boolean().default(false),
})

export const updateAddressSchema = addAddressSchema.partial()

export const adminUpdateUserSchema = z.object({
  name:       z.string().trim().min(2).max(60).optional(),
  email:      z.string().trim().email('Invalid email address').optional(),
  phone:      z.string().trim().max(20).optional().nullable(),
  roles:      z.array(z.enum(['buyer', 'seller', 'admin'])).min(1, 'At least one role is required').optional(),
  isVerified: z.boolean().optional(),
})

