import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Truck } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import OrderTimeline from '../../components/orders/OrderTimeline'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { PageSpinner } from '../../components/common/Spinner'
import { ordersApi } from '../../api/orders.api'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

const NEXT = {
  pending:   { status: 'confirmed', label: 'Confirm Order',    needsTracking: false },
  confirmed: { status: 'shipped',   label: 'Mark as Shipped',  needsTracking: true  },
}

export default function SellerOrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [updating, setUpdating]   = useState(false)
  const [tracking, setTracking]   = useState('')

  useEffect(() => {
    ordersApi.getSellerOrderById(id)
      .then(({ data }) => setOrder(data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAction() {
    const next = NEXT[order.status]
    if (!next) return
    if (next.needsTracking && !tracking.trim()) {
      toast.error('Please enter a tracking number')
      return
    }
    setUpdating(true)
    try {
      const { data } = await ordersApi.updateStatus(id, {
        status: next.status,
        ...(next.needsTracking ? { trackingNumber: tracking.trim() } : {}),
      })
      setOrder(data.data)
      toast.success(`Order marked as ${next.status}`)
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to update order')
    } finally {
      setUpdating(false) }
  }

  if (loading) return <PageWrapper><PageSpinner /></PageWrapper>
  if (!order)  return <PageWrapper><div className="text-center py-20 text-gray-500">Order not found.</div></PageWrapper>

  const next = NEXT[order.status]

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to="/seller/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-4">
          <ChevronLeft size={16} /> Back to Orders
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Order Timeline</h2>
          <OrderTimeline status={order.status} timeline={order.timeline} />
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                <p className="text-xs text-gray-500">Qty: {item.qty} × {formatCurrency(item.price)}</p>
              </div>
              <p className="text-sm font-bold text-orange-500 shrink-0">{formatCurrency(item.qty * item.price)}</p>
            </div>
          ))}
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-base font-black text-orange-500">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Ship To</h2>
          <p className="text-sm text-gray-700">
            {[order.shippingAddress?.street, order.shippingAddress?.city, order.shippingAddress?.country].filter(Boolean).join(', ')}
          </p>
        </div>

        {/* Action */}
        {next && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
            {next.needsTracking && (
              <Input
                label="Tracking Number"
                placeholder="e.g. RPOST1234567890"
                leadingIcon={Truck}
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            )}
            <Button fullWidth size="lg" loading={updating} onClick={handleAction}>
              {next.label}
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
