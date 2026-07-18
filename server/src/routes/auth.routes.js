import { Router } from 'express'
import { register, login, refresh, logout } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { verifyToken } from '../middleware/auth.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), register)
router.post('/login',    authLimiter, validate(loginSchema),    login)
router.post('/refresh',  authLimiter, refresh)
router.post('/logout',   verifyToken, logout)

export default router
