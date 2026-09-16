import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { authApi } from '../api/auth.api'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.getNotifications()
      .then(({ data }) => setNotifications(data.data ?? []))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false))
  }, [])

  async function markRead(notification) {
    if (notification.read) return
    try {
      await authApi.markNotificationRead(notification._id)
      setNotifications((items) => items.map((item) =>
        item._id === notification._id ? { ...item, read: true } : item
      ))
    } catch {
      toast.error('Failed to update notification')
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Notifications</h1>
        {loading ? <p className="text-sm text-gray-500">Loading notifications...</p> : notifications.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500">
            <Bell size={30} className="mx-auto mb-2 text-gray-300" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            {notifications.map((notification) => (
              <button
                key={notification._id}
                onClick={() => markRead(notification)}
                className={`w-full text-left p-4 hover:bg-gray-50 ${notification.read ? '' : 'bg-orange-50/50'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
