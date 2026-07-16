import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, DollarSign, ShoppingBag, Plus, TrendingUp, ChevronRight,
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Sidebar from '../../components/layout/Sidebar'
import OrderCard from '../../components/orders/OrderCard'
import { PageSpinner } from '../../components/common/Spinner'
import { ordersApi } from '../../api/orders.api'
import { productsApi } from '../../api/products.api'
import { formatCurrency } from '../../utils/formatCurrency'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'

const SELLER_NAV = [
  { to: '/seller/dashboard', icon: TrendingUp, label: 'Overview' },
  { to: '/seller/listings', icon: Package, label: 'My Listings' },
  { to: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
]

export default function SellerDashboardPage() {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [listingCount, setListingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      ordersApi.getEarnings(),
      ordersApi.getSellerOrders({ page: 1, limit: 5 }),
      productsApi.getMyListings({ limit: 1 }),
    ])
      .then(([earningsRes, ordersRes, listingsRes]) => {
        setEarnings(earningsRes.data?.data ?? {})
        setRecentOrders(ordersRes.data?.data ?? [])
        setListingCount(listingsRes.data?.pagination?.total ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <Sidebar items={SELLER_NAV} title="Seller" className="hidden md:block" />

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
              </div>
              <Button as={Link} to="/seller/listings/new">
                <Plus size={16} /> New Listing
              </Button>
            </div>

            {loading ? (
              <PageSpinner />
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    icon={<DollarSign size={20} className="text-green-600" />}
                    label="Total Earnings"
                    value={formatCurrency(earnings?.totalEarnings ?? 0)}
                    bg="bg-green-50"
                  />
                  <StatCard
                    icon={<ShoppingBag size={20} className="text-blue-600" />}
                    label="Total Orders"
                    value={earnings?.totalOrders ?? 0}
                    bg="bg-blue-50"
                  />
                  <StatCard
                    icon={<Package size={20} className="text-orange-600" />}
                    label="Active Listings"
                    value={listingCount}
                    bg="bg-orange-50"
                  />
                  <StatCard
                    icon={<TrendingUp size={20} className="text-purple-600" />}
                    label="Pending Orders"
                    value={earnings?.pendingOrders ?? 0}
                    bg="bg-purple-50"
                  />
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
                    <Link to="/seller/orders" className="text-sm text-orange-500 hover:underline flex items-center gap-0.5">
                      View all <ChevronRight size={14} />
                    </Link>
                  </div>
                  {recentOrders.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <OrderCard
                          key={order._id}
                          order={order}
                          href={`/seller/orders/${order._id}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function StatCard({ icon, label, value, bg }) {
  return (
    <div className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-lg font-black text-gray-900">{value}</p>
      </div>
    </div>
  )
}
