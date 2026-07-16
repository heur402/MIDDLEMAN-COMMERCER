import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Truck } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import OrderTimeline from '../../components/orders/OrderTimeline'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import Button from '../../components/common/Button'
import { PageSpinner } from '../../components/common/Spinner'
import { ordersApi } from '../../api/orders.api'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

export default function BuyerOrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    ordersApi
      .getById(id)
      .then(({ data }) => setOrder(data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  async function markDelivered() {
    setConfirming(true)
    try {
      const { data } = await ordersApi.markDelivered(id)
      setOrder(data.data)
      toast.success('Order marked as delivered!')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update order')
    } finally {
      setConfirming(false)
    }
  }

  if (loading) return <PageWrapper><PageSpinner /></PageWrapper>
  if (!order) return <PageWrapper><div className="text-center py-20 text-gray-500">Order not found.</div></PageWrapper>

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to="/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-4">
          <ChevronLeft size={16} /> Back to Orders
        </Link>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Order Progress</h2>
          <OrderTimeline status={order.status} timeline={order.timeline} />
        </div>

        {/* Tracking number */}
        {order.trackingNumber && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-center gap-2">
            <Truck size={16} className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Tracking Number</p>
              <p className="text-sm text-blue-700 font-mono">{order.trackingNumber}</p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="text-sm font-medium text-gray-800 hover:text-orange-600 line-clamp-1">
                  {item.title}
                </Link>
                <p className="text-xs text-gray-500">Qty: {item.qty} × {formatCurrency(item.price)}</p>
              </div>
              <p className="text-sm font-bold text-orange-500 shrink-0">
                {formatCurrency(item.qty * item.price)}
              </p>
            </div>
          ))}
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-base font-black text-orange-500">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h2>
          <p className="text-sm text-gray-700">
            {[order.shippingAddress?.street, order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>

        {/* Action: mark delivered */}
        {order.status === 'shipped' && (
          <Button fullWidth size="lg" onClick={markDelivered} loading={confirming}>
            Confirm Delivery Received
          </Button>
        )}
      </div>
    </PageWrapper>
  )
}
