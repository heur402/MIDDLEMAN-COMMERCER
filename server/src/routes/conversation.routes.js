import { Router } from 'express'
import {
  listConversations, startConversation,
  getConversation, sendMessage,
} from '../controllers/conversation.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { messageLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.use(verifyToken)

router.get('/',             listConversations)
router.post('/',            startConversation)
router.get('/:id',          getConversation)
router.post('/:id/messages', messageLimiter, sendMessage)

export default router
