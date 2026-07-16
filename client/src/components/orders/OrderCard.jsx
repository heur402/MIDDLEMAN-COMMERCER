import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import OrderStatusBadge from './OrderStatusBadge'

export default function OrderCard({ order, href }) {
  const firstItem = order.items?.[0]

  return (
    <Link
      to={href ?? `/orders/${order._id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail of first item */}
        <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
          {firstItem?.image ? (
            <img src={firstItem.image} alt={firstItem.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package size={24} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5 line-clamp-1">
                {firstItem?.title}
                {order.items?.length > 1 && (
                  <span className="text-gray-500 font-normal"> +{order.items.length - 1} more</span>
                )}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-bold text-orange-500">{formatCurrency(order.totalAmount)}</p>
            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
