import { Router } from 'express'
import { createReview, getSellerReviews, getProductReviews } from '../controllers/review.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { requireRoles } from '../middleware/requireRoles.js'
import { validate } from '../middleware/validate.js'
import { createReviewSchema } from '../schemas/review.schema.js'

const router = Router()

// Public
router.get('/seller/:sellerId',   getSellerReviews)
router.get('/product/:productId', getProductReviews)

// Buyer only
router.post('/', verifyToken, requireRoles('buyer'), validate(createReviewSchema), createReview)

export default router
