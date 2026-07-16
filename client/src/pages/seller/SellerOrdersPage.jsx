import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Truck } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Sidebar from '../../components/layout/Sidebar'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { ordersApi } from '../../api/orders.api'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { TrendingUp, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

const SELLER_NAV = [
  { to: '/seller/dashboard', icon: TrendingUp, label: 'Overview' },
  { to: '/seller/listings', icon: Package, label: 'My Listings' },
  { to: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
]

const STATUS_ACTIONS = {
  pending:   { action: 'confirmed', label: 'Confirm Order' },
  confirmed: { action: 'shipped',   label: 'Mark as Shipped', needsTracking: true },
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionOrder, setActionOrder] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  function load(p = page) {
    setLoading(true)
    ordersApi
      .getSellerOrders({ page: p, limit: 15 })
      .then(({ data }) => {
        setOrders(data.data ?? [])
        setPagination(data.pagination ?? { page: 1, totalPages: 1 })
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  async function updateStatus(orderId, status, tracking) {
    setUpdatingId(orderId)
    try {
      await ordersApi.updateStatus(orderId, { status, trackingNumber: tracking })
      toast.success(`Order marked as ${status}`)
      load()
      setActionOrder(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update order')
    } finally {
      setUpdatingId(null)
    }
  }

  function handleAction(order) {
    const next = STATUS_ACTIONS[order.status]
    if (!next) return
    if (next.needsTracking) {
      setTrackingNumber('')
      setActionOrder(order)
    } else {
      updateStatus(order._id, next.action)
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <Sidebar items={SELLER_NAV} title="Seller" className="hidden md:block" />

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 mb-6">Orders to Fulfill</h1>

            {loading ? (
              <PageSpinner />
            ) : orders.length === 0 ? (
              <EmptyState icon={Package} title="No orders yet" description="New customer orders will appear here." />
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <tr>
                        <th className="text-left px-4 py-3">Order</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell">Date</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell">Total</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-right px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                              <p className="text-xs text-gray-500">{order.items?.[0]?.title}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell font-medium text-orange-500">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="px-4 py-3">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {STATUS_ACTIONS[order.status] && (
                                <Button
                                  size="xs"
                                  loading={updatingId === order._id}
                                  onClick={() => handleAction(order)}
                                >
                                  {STATUS_ACTIONS[order.status].label}
                                </Button>
                              )}
                              <Link
                                to={`/seller/orders/${order._id}`}
                                className="p-1 text-gray-400 hover:text-orange-500"
                              >
                                <ChevronRight size={16} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onChange={setPage}
                  className="mt-4"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tracking number modal */}
      <Modal
        isOpen={!!actionOrder}
        onClose={() => setActionOrder(null)}
        title="Add Tracking Number"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          Enter the tracking number for this shipment. Buyers will see this on their order.
        </p>
        <Input
          label="Tracking Number"
          placeholder="e.g. RPOST1234567890"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          leadingIcon={Truck}
        />
        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setActionOrder(null)}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            loading={!!updatingId}
            disabled={!trackingNumber.trim()}
            onClick={() => updateStatus(actionOrder._id, 'shipped', trackingNumber.trim())}
          >
            Mark Shipped
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
