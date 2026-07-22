import { Router } from 'express'
import {
  listConversations, startConversation,
  getConversation, sendMessage,
} from '../controllers/conversation.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { messageLimiter } from '../middleware/rateLimiter.js'
import { startConversationSchema, sendMessageSchema } from '../schemas/conversation.schema.js'

const router = Router()

router.use(verifyToken)

router.get('/',              listConversations)
router.post('/',             validate(startConversationSchema), startConversation)
router.get('/:id',           getConversation)
router.post('/:id/messages', messageLimiter, validate(sendMessageSchema), sendMessage)

export default router
