import { Router } from 'express'
import { getStorefront } from '../controllers/storefront.controller.js'

const router = Router()

// Public — no auth required
router.get('/:sellerId', getStorefront)

export default router
