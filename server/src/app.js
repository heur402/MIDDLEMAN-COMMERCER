import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { errorHandler } from './middleware/errorHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: env.CLIENT_ORIGIN,
  credentials: true,
}))

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api', generalLimiter)

// ── Static uploads (local fallback) ──────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'MiddleMan API is running' })
})

// ── Routes (imported lazily to avoid circular deps) ──────────────────────────
// Routes are registered in server.js after app is created, OR here directly:
import authRoutes        from './routes/auth.routes.js'
import userRoutes        from './routes/user.routes.js'
import productRoutes     from './routes/product.routes.js'
import sellerRoutes      from './routes/seller.routes.js'
import orderRoutes       from './routes/order.routes.js'
import storefrontRoutes  from './routes/storefront.routes.js'
import conversationRoutes from './routes/conversation.routes.js'
import reviewRoutes      from './routes/review.routes.js'
import disputeRoutes     from './routes/dispute.routes.js'
import adminRoutes       from './routes/admin.routes.js'

app.use('/api/auth',          authRoutes)
app.use('/api/users',         userRoutes)
app.use('/api/products',      productRoutes)
app.use('/api/seller',        sellerRoutes)
app.use('/api/orders',        orderRoutes)
app.use('/api/storefront',    storefrontRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/reviews',       reviewRoutes)
app.use('/api/disputes',      disputeRoutes)
app.use('/api/admin',         adminRoutes)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler)

export default app
