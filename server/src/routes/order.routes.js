import { Router } from 'express'
import {
  placeOrders,
  getBuyerOrders,
  getBuyerOrder,
  trackGuestOrder,
  markDelivered,
} from '../controllers/order.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { placeOrderSchema, orderQuerySchema, trackOrderSchema } from '../schemas/order.schema.js'

const router = Router()

// ── Public / guest routes (no auth required) ──────────────────────────────────
// Place an order — works for both guests and logged-in users
// verifyToken is called optionally by the controller via req.user?.userId
router.post('/',      validate(placeOrderSchema), placeOrders)

// Track a guest order by orderId + email
router.get('/track',  validate(trackOrderSchema, 'query'), trackGuestOrder)

// Mark as delivered — guest uses ?email= query param, auth user uses token
router.patch('/:id/deliver', markDelivered)

// ── Authenticated buyer routes ────────────────────────────────────────────────
router.get('/',    verifyToken, validate(orderQuerySchema, 'query'), getBuyerOrders)
router.get('/:id', verifyToken, getBuyerOrder)

export default router
