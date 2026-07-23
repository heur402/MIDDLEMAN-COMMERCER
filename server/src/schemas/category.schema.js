import { z } from 'zod'

function slugify(str) {
  return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const createCategorySchema = z.object({
  name:        z.string().trim().min(1, 'Name is required').max(60),
  slug:        z.string().trim().optional().transform((v, ctx) => {
    // auto-generate slug from name if not provided
    if (!v) {
      const parent = ctx?.path?.length ? ctx : null
      return undefined // handled in controller
    }
    return slugify(v)
  }),
  description: z.string().trim().max(200).default(''),
  icon:        z.string().trim().optional().nullable(),
})

export const updateCategorySchema = createCategorySchema.partial()
