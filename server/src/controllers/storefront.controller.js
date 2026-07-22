import { User } from '../models/User.js'
import { Product } from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// ── GET /api/storefront/:sellerId ─────────────────────────────────────────────
export const getStorefront = asyncHandler(async (req, res) => {
  const { sellerId } = req.params

  const seller = await User.findById(sellerId)
    .select('name avatar rating reviewCount createdAt roles')
    .lean()

  if (!seller) throw ApiError.notFound('Seller not found')
  if (!seller.roles.includes('seller')) throw ApiError.notFound('Seller not found')

  const products = await Product.find({
    sellerId,
    status: 'published',
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  res.json({ success: true, data: { seller, products } })
})
