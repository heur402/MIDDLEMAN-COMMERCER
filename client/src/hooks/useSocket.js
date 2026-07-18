import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || ''

/**
 * Initialise and return a Socket.IO client instance.
 * Automatically connects when user is authenticated and
 * disconnects on logout or component unmount.
 *
 * @returns {{ socket: Socket | null, connected: boolean }}
 */
export function useSocket() {
  const { accessToken, isAuthenticated } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
    })

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message)
    })

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [isAuthenticated, accessToken])

  const emit = useCallback((event, payload) => {
    socketRef.current?.emit(event, payload)
  }, [])

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler)
    return () => socketRef.current?.off(event, handler)
  }, [])

  return { socket: socketRef.current, emit, on }
}
