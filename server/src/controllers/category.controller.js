import { Category } from '../models/Category.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/** Slugify a string */
function slugify(str) {
  return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ── GET /api/categories — public, returns only active categories ──────────────
export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .lean()
  res.json({ success: true, data: categories })
})

// ── GET /api/categories/all — admin: returns all including inactive ────────────
export const listAllCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find()
    .sort({ name: 1 })
    .populate('createdBy', 'name email')
    .lean()
  res.json({ success: true, data: categories })
})

// ── POST /api/categories — admin creates a category ──────────────────────────
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body
  const slug = slugify(name)

  const existing = await Category.findOne({ slug })
  if (existing) throw ApiError.conflict(`Category "${name}" already exists`)

  const category = await Category.create({
    name,
    slug,
    description: description ?? '',
    icon:        icon ?? null,
    createdBy:   req.user.userId,
  })

  res.status(201).json({ success: true, data: category })
})

// ── PUT /api/categories/:id — admin updates a category ───────────────────────
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, isActive } = req.body
  const category = await Category.findById(req.params.id)
  if (!category) throw ApiError.notFound('Category not found')

  if (name !== undefined) {
    category.name = name
    category.slug = slugify(name)
  }
  if (description !== undefined) category.description = description
  if (icon        !== undefined) category.icon        = icon
  if (isActive    !== undefined) category.isActive    = isActive

  await category.save()
  res.json({ success: true, data: category })
})

// ── DELETE /api/categories/:id — admin deletes a category ────────────────────
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) throw ApiError.notFound('Category not found')
  await category.deleteOne()
  res.json({ success: true, message: 'Category deleted' })
})
