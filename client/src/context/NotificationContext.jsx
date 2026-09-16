import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth.api'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([])
      return
    }

    const { data } = await authApi.getNotifications()
    setNotifications(data.data ?? [])
  }, [isAuthenticated])

  useEffect(() => {
    loadNotifications().catch(() => {
      setNotifications([])
    })
  }, [loadNotifications])

  const markRead = useCallback(async (notification) => {
    if (notification.read) return

    await authApi.markNotificationRead(notification._id)
    setNotifications((items) => items.map((item) =>
      item._id === notification._id ? { ...item, read: true } : item
    ))
  }, [])

  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter((notification) => !notification.read).length,
    markRead,
    refresh: loadNotifications,
  }), [loadNotifications, markRead, notifications])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}
