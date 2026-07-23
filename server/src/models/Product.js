import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    sellerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },
    title:        { type: String, required: true, trim: true, maxlength: 150 },
    description:  { type: String, default: '', maxlength: 5000 },
    price:        { type: Number, required: true, min: 0 },
    originalPrice:{ type: Number, default: null },

    // Category is now an ObjectId reference to admin-managed Category documents
    category:     { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    condition:    {
      type: String,
      required: true,
      enum: ['new', 'like_new', 'good', 'fair', 'poor'],
      default: 'new',
    },
    images:       { type: [String], default: [] },
    stock:        { type: Number, required: true, min: 0, default: 1 },
    status:       {
      type: String,
      enum: ['published', 'draft', 'inactive'],
      default: 'published',
    },
    tags:         { type: [String], default: [] },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0 },
  },
  { timestamps: true }
)

// ── Indexes ───────────────────────────────────────────────────────────────────
productSchema.index({ title: 'text', description: 'text', tags: 'text' })
productSchema.index({ status: 1, category: 1 })
productSchema.index({ sellerId: 1, status: 1 })
productSchema.index({ price: 1 })
productSchema.index({ createdAt: -1 })

export const Product = mongoose.model('Product', productSchema)
