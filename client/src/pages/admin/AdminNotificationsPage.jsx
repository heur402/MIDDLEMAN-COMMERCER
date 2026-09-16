import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { adminApi } from '../../api/admin.api'
import toast from 'react-hot-toast'

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getNotifications()
      .then(({ data }) => setNotifications(data.data ?? []))
      .catch(() => toast.error('Failed to load sent notifications'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Sent Notifications</h1>
      <p className="text-sm text-gray-500 mb-6">Review messages sent to sellers and buyers.</p>
      {loading ? <p className="text-sm text-gray-500">Loading notifications...</p> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {notifications.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">No notifications sent yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div key={notification._id} className="p-4">
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold text-gray-900">{notification.title}</p>
                    <span className="text-xs text-gray-400">{notification.userId?.name ?? notification.userId?.email}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
