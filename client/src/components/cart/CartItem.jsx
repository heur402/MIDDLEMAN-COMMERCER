import { Trash2, Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'
import { useCart } from '../../context/CartContext'

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* Thumbnail */}
      <Link to={`/products/${item.productId}`} className="shrink-0">
        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="text-sm font-medium text-gray-900 hover:text-orange-600 line-clamp-2 leading-snug"
        >
          {item.title}
        </Link>
        <p className="text-xs text-gray-500 mt-0.5">Seller: {item.sellerName}</p>
        <p className="text-sm font-bold text-orange-500 mt-1">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* Qty + remove */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <button
          onClick={() => removeItem(item.productId)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={15} />
        </button>

        <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => updateQty(item.productId, item.qty - 1)}
            disabled={item.qty <= 1}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
          <button
            onClick={() => updateQty(item.productId, item.qty + 1)}
            disabled={item.qty >= item.stock}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
