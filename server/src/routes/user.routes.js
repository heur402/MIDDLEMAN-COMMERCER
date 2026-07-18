import { Router } from 'express'
import {
  getMe, updateMe, becomeSeller,
  addAddress, updateAddress, deleteAddress,
} from '../controllers/user.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { updateProfileSchema, addAddressSchema, updateAddressSchema } from '../schemas/user.schema.js'

const router = Router()

// All user routes require authentication
router.use(verifyToken)

router.get('/me',  getMe)
router.put('/me',  validate(updateProfileSchema), updateMe)
router.post('/me/become-seller', becomeSeller)

router.post('/me/addresses',                    validate(addAddressSchema),    addAddress)
router.put('/me/addresses/:addressId',          validate(updateAddressSchema), updateAddress)
router.delete('/me/addresses/:addressId',                                      deleteAddress)

export default router
