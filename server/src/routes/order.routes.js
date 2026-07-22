import { Router } from 'express'
import {
  placeOrders, getBuyerOrders, getBuyerOrder, markDelivered,
} from '../controllers/order.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { requireRoles } from '../middleware/requireRoles.js'
import { validate } from '../middleware/validate.js'
import { placeOrderSchema, orderQuerySchema } from '../schemas/order.schema.js'

const router = Router()

router.use(verifyToken)
router.use(requireRoles('buyer'))

router.post('/',               validate(placeOrderSchema),      placeOrders)
router.get('/',                validate(orderQuerySchema, 'query'), getBuyerOrders)
router.get('/:id',             getBuyerOrder)
router.patch('/:id/deliver',   markDelivered)

export default router
