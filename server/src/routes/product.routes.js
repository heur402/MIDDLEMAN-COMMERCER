import { Router } from 'express'
import { listProducts, searchProducts, getProduct } from '../controllers/product.controller.js'
import { validate } from '../middleware/validate.js'
import { productQuerySchema } from '../schemas/product.schema.js'

const router = Router()

// All public — no auth required
router.get('/',        validate(productQuerySchema, 'query'), listProducts)
router.get('/search',  validate(productQuerySchema, 'query'), searchProducts)
router.get('/:id',     getProduct)

export default router
