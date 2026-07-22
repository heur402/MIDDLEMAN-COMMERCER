import { Link } from 'react-router-dom'
import {
  Package, MessageCircle, Star, AlertTriangle, Settings, ChevronRight,
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { useAuth } from '../../context/AuthContext'
import { useBuyerOrders } from '../../hooks/useOrders'
import OrderCard from '../../components/orders/OrderCard'
import { PageSpinner } from '../../components/common/Spinner'

const QUICK_LINKS = [
  { to: '/orders',   icon: Package,       label: 'My Orders',  desc: 'Track purchases'      },
  { to: '/messages', icon: MessageCircle, label: 'Messages',   desc: 'Chat with sellers'    },
  { to: '/reviews',  icon: Star,          label: 'Reviews',    desc: 'Reviews you left'     },
  { to: '/disputes', icon: AlertTriangle, label: 'Disputes',   desc: 'Open disputes'        },
  { to: '/profile',  icon: Settings,      label: 'Profile',    desc: 'Account settings'     },
]

export default function BuyerDashboardPage() {
  const { user } = useAuth()
  const { orders, loading } = useBuyerOrders({ limit: 3 })

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Greeting header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-xl shrink-0 overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Hi, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <Link
            to="/profile"
            className="ml-auto text-sm text-orange-500 hover:underline flex items-center gap-1"
          >
            Edit profile <ChevronRight size={14} />
          </Link>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          {QUICK_LINKS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 text-center shadow-sm hover:shadow-md border border-transparent hover:border-orange-200 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Icon size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-800">{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-sm text-orange-500 hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <PageSpinner />
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package size={36} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No orders yet.</p>
              <Link to="/browse" className="text-sm text-orange-500 hover:underline mt-1 inline-block">
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
