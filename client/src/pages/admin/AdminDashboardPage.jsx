import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Package, AlertTriangle, TrendingUp, ChevronRight, DollarSign } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { PageSpinner } from '../../components/common/Spinner'
import { adminApi } from '../../api/admin.api'
import { formatCurrency } from '../../utils/formatCurrency'

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    adminApi.getAnalytics()
      .then(({ data }) => setAnalytics(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {loading ? <PageSpinner /> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Gross Merchandise Value', value: formatCurrency(analytics?.gmv ?? 0),   icon: DollarSign,    bg: 'bg-green-50',  color: 'text-green-600'  },
              { label: 'Total Orders',             value: analytics?.totalOrders ?? 0,            icon: Package,       bg: 'bg-blue-50',   color: 'text-blue-600'   },
              { label: 'Active Users',             value: analytics?.activeUsers ?? 0,            icon: Users,         bg: 'bg-purple-50', color: 'text-purple-600' },
              { label: 'Open Disputes',            value: analytics?.openDisputes ?? 0,           icon: AlertTriangle, bg: 'bg-red-50',    color: 'text-red-600'    },
            ].map(({ label, value, icon: Icon, bg, color }) => (
              <div key={label} className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
                <div className={`p-2 rounded-full bg-white/70 ${color}`}><Icon size={18} /></div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{label}</p>
                  <p className="text-lg font-black text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { to: '/admin/users',      icon: Users,         label: 'Manage Users',     desc: 'View and ban users'       },
              { to: '/admin/listings',   icon: Package,       label: 'Moderate Listings', desc: 'Review and deactivate'   },
              { to: '/admin/categories', icon: AlertTriangle, label: 'Categories',        desc: 'Manage product categories'},
            ].map(({ to, icon: Icon, label, desc }) => (
              <Link key={to} to={to}
                className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
              >
                <div className="p-3 rounded-full bg-orange-50 group-hover:bg-orange-500 text-orange-500 group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-400 group-hover:text-orange-500" />
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  )
}
