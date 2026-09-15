import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, MapPin, Truck, CheckCircle } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/common/Button'
import OrderTimeline from '../components/orders/OrderTimeline'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import { ordersApi } from '../api/orders.api'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'

export default function GuestOrderTrackingPage() {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(() => searchParams.get('orderId') ?? '')
  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleTrack(e) {
    e.preventDefault()
    setError('')
    setOrder(null)
    if (!orderId.trim()) { setError('Please enter your Order ID.'); return }
    setLoading(true)
    try {
      const { data } = await ordersApi.trackGuest(orderId.trim())
      setOrder(data.data)
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Order not found. Check your Order ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkDelivered() {
    try {
      const { data } = await ordersApi.markDelivered(order._id)
      setOrder(data.data)
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to update order')
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Track Your Order</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your Order ID to see the latest status.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Order ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 6684abc123def456789"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setError('') }}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                error ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <Button type="submit" loading={loading}>
              <Search size={16} /> Track
            </Button>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          <p className="text-xs text-gray-400 mt-2">
            Your Order ID was included in your order confirmation.
          </p>
        </form>

        {/* Result */}
        {order && (
          <div className="space-y-4">

            {/* Status header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Order</p>
                  <p className="text-base font-bold text-gray-900 font-mono">
                    #{order.orderRef ?? order._id.slice(-10).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <OrderTimeline status={order.status} timeline={order.timeline} />
            </div>

            {/* Tracking number */}
            {order.trackingNumber && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Truck size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">Shipping Tracking Number</p>
                  <p className="text-sm text-blue-700 font-mono mt-0.5">{order.trackingNumber}</p>
                </div>
              </div>
            )}

            {/* Shipping address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={15} className="text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700">Shipping Address</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {[
                    order.shippingAddress.street,
                    order.shippingAddress.city,
                    order.shippingAddress.state,
                    order.shippingAddress.zip,
                    order.shippingAddress.country,
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      {item.image
                        ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={16} /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty} × {formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-sm font-bold text-orange-500 shrink-0">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-base font-black text-orange-500">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {/* Confirm delivery CTA */}
            {order.status === 'shipped' && (
              <button
                onClick={handleMarkDelivered}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle size={18} /> I Received My Order
              </button>
            )}

            {order.status === 'delivered' && (
              <div className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold text-sm">
                <CheckCircle size={18} /> Delivery confirmed — thank you!
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
