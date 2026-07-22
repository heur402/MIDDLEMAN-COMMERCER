import { Router } from 'express'
import {
  placeOrders,
  getBuyerOrders,
  getBuyerOrder,
  trackGuestOrder,
  markDelivered,
} from '../controllers/order.controller.js'
import { verifyToken, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { placeOrderSchema, orderQuerySchema, trackOrderSchema } from '../schemas/order.schema.js'

const router = Router()

// Place order — guests + logged-in users both allowed
router.post('/',      optionalAuth, validate(placeOrderSchema), placeOrders)

// Guest order tracking by orderId + email
router.get('/track',  validate(trackOrderSchema, 'query'), trackGuestOrder)

// Mark delivered — guest uses ?email= param, auth user uses token
router.patch('/:id/deliver', markDelivered)

// Authenticated buyer history
router.get('/',    verifyToken, validate(orderQuerySchema, 'query'), getBuyerOrders)
router.get('/:id', verifyToken, getBuyerOrder)

export default router
