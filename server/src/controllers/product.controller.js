import { Product } from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { paginate } from '../utils/paginate.js'

// ── Public ────────────────────────────────────────────────────────────────────

// GET /api/products
export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, category, condition, minPrice, maxPrice, sort } = req.query

  const filter = { status: 'published' }
  if (category)  filter.category  = category
  if (condition) filter.condition = condition
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  const sortMap = {
    newest:     { createdAt: -1 },
    price_asc:  { price: 1 },
    price_desc: { price: -1 },
    rating:     { rating: -1 },
  }

  const result = await paginate(Product, filter, {
    page,
    limit,
    sort: sortMap[sort] ?? sortMap.newest,
    populate: [
      { path: 'sellerId', select: 'name avatar rating reviewCount' },
      { path: 'category', select: 'name slug icon' },
    ],
  })

  res.json({ success: true, ...result })
})

// GET /api/products/search
export const searchProducts = asyncHandler(async (req, res) => {
  const { q, page, limit, category, condition, minPrice, maxPrice, sort } = req.query
  if (!q) throw ApiError.badRequest('Search query is required')

  const filter = {
    status: 'published',
    $text: { $search: q },
  }
  if (category)  filter.category  = category
  if (condition) filter.condition = condition
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  const sortMap = {
    newest:     { createdAt: -1 },
    price_asc:  { price: 1 },
    price_desc: { price: -1 },
    rating:     { rating: -1 },
  }

  const result = await paginate(Product, filter, {
    page,
    limit,
    sort: sortMap[sort] ?? { score: { $meta: 'textScore' } },
    populate: [
      { path: 'sellerId', select: 'name avatar rating reviewCount' },
      { path: 'category', select: 'name slug icon' },
    ],
  })

  res.json({ success: true, ...result })
})

// GET /api/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('sellerId', 'name avatar rating reviewCount createdAt')
    .populate('category', 'name slug icon')
  if (!product) throw ApiError.notFound('Product not found')
  res.json({ success: true, data: product })
})
