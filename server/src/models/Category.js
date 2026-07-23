import mongoose from 'mongoose'

/**
 * Categories are created and managed exclusively by admins.
 * Sellers choose from this list when creating a product.
 */
const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, unique: true, maxlength: 60 },
    slug:        { type: String, required: true, trim: true, unique: true, lowercase: true },
    description: { type: String, default: '', maxlength: 200 },
    icon:        { type: String, default: null },   // emoji or icon name
    isActive:    { type: Boolean, default: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

categorySchema.index({ slug: 1 }, { unique: true })
categorySchema.index({ isActive: 1 })

export const Category = mongoose.model('Category', categorySchema)
