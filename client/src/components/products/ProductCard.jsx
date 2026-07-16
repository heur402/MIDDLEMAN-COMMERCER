import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { formatCurrency, discountPercent } from '../../utils/formatCurrency'
import { useCart } from '../../context/CartContext'
import { cn } from '../../utils/cn'

/**
 * Dense product grid card — styled after Kikuu's card design.
 * Shows: image, title, price, discount badge, rating, add-to-cart.
 */
export default function ProductCard({ product, className }) {
  const { addItem } = useCart()
  const discount = discountPercent(product.originalPrice, product.price)

  function handleAddToCart(e) {
    e.preventDefault() // don't navigate to product detail
    addItem(product)
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className={cn(
        'group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {discount}
          </span>
        )}

        {/* New badge */}
        {product.condition === 'new' && !discount && (
          <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            NEW
          </span>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded">
              Out of stock
            </span>
          </div>
        )}

        {/* Quick add-to-cart (hover overlay on desktop) */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity md:flex hidden items-center justify-center"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart size={14} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <h3 className="text-xs text-gray-800 line-clamp-2 leading-snug">{product.title}</h3>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-orange-500">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating row */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-gray-500">
              {product.rating.toFixed(1)}
              {product.reviewCount > 0 && ` (${product.reviewCount})`}
            </span>
          </div>
        )}

        {/* Mobile add to cart */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="md:hidden mt-auto w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingCart size={12} />
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  )
}
