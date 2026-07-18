import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './src/app.js'
import { connectDB } from './src/config/db.js'
import { env } from './src/config/env.js'

const httpServer = createServer(app)

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  },
})

// Attach io to the app so controllers can emit events
app.set('io', io)

// Basic connection handler (Phase 2 handlers go in src/sockets/)
io.on('connection', (socket) => {
  console.log(`[Socket] connected: ${socket.id}`)

  socket.on('join:conversation', ({ conversationId }) => {
    socket.join(`conv:${conversationId}`)
  })

  socket.on('leave:conversation', ({ conversationId }) => {
    socket.leave(`conv:${conversationId}`)
  })

  socket.on('order:join', ({ orderId }) => {
    socket.join(`order:${orderId}`)
  })

  socket.on('disconnect', (reason) => {
    console.log(`[Socket] disconnected: ${socket.id} — ${reason}`)
  })
})

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = env.PORT || 5000

async function start() {
  await connectDB()
  httpServer.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`)
    console.log(`🌍  Environment: ${env.NODE_ENV}`)
  })
}

start()
