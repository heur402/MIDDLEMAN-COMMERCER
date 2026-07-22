import { useState } from 'react'
import { Search, Package } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import OrderTimeline from '../components/orders/OrderTimeline'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import { ordersApi } from '../api/orders.api'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'

export default function GuestOrderTrackingPage() {
  const [orderId, setOrderId]   = useState('')
  const [email, setEmail]       = useState('')
  const [order, setOrder]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleTrack(e) {
    e.preventDefault()
    setError('')
    setOrder(null)
    if (!orderId.trim() || !email.trim()) {
      setError('Both Order ID and email are required.')
      return
    }
    setLoading(true)
    try {
      const { data } = await ordersApi.trackGuest(orderId.trim(), email.trim())
      setOrder(data.data)
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Order not found. Check your Order ID and email.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkDelivered() {
    try {
      const { data } = await ordersApi.markDelivered(order._id, email.trim())
      setOrder(data.data)
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to update order')
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Track Your Order</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your Order ID and the email you used at checkout.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-sm p-6 space-y-4 mb-6">
          <Input
            label="Order ID"
            required
            placeholder="e.g. 6684abc123def456789"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <Input
            label="Email address"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth loading={loading} size="lg">
            <Search size={16} />
            Track Order
          </Button>
        </form>

        {/* Order result */}
        {order && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Order</p>
                  <p className="text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <OrderTimeline status={order.status} timeline={order.timeline} />
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-orange-500">{formatCurrency(item.price * item.qty)}</p>
                </div>
              ))}
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-base font-black text-orange-500">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {/* Tracking number */}
            {order.trackingNumber && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-800">Tracking Number</p>
                <p className="text-sm text-blue-700 font-mono mt-0.5">{order.trackingNumber}</p>
              </div>
            )}

            {/* Confirm delivery */}
            {order.status === 'shipped' && (
              <Button fullWidth size="lg" onClick={handleMarkDelivered}>
                Confirm I Received My Order
              </Button>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
