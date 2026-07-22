import { Router } from 'express'
import { raiseDispute, getMyDisputes, getDispute, addEvidence } from '../controllers/dispute.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { uploadMiddleware } from '../middleware/upload.js'
import { createDisputeSchema } from '../schemas/dispute.schema.js'

const router = Router()

router.use(verifyToken)

router.post('/',                    validate(createDisputeSchema), raiseDispute)
router.get('/',                     getMyDisputes)
router.get('/:id',                  getDispute)
router.post('/:id/evidence',        uploadMiddleware('evidence', 5), addEvidence)

export default router
