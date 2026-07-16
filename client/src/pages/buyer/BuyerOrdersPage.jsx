import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import OrderCard from '../../components/orders/OrderCard'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { ordersApi } from '../../api/orders.api'

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
]

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    const params = { page, limit: 10 }
    if (activeTab) params.status = activeTab

    ordersApi
      .getMyOrders(params)
      .then(({ data }) => {
        setOrders(data.data ?? [])
        setPagination(data.pagination ?? { page: 1, totalPages: 1 })
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [page, activeTab])

  function handleTabChange(tab) {
    setActiveTab(tab)
    setPage(1)
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">My Orders</h1>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <PageSpinner />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders found"
            description="Orders you place will appear here."
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={setPage}
              className="mt-4"
            />
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
