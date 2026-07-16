import ProductCard from './ProductCard'
import { cn } from '../../utils/cn'

/**
 * Responsive product grid — tight at mobile (2 cols), wider on desktop.
 */
export default function ProductGrid({ products = [], loading = false, className }) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3', className)}>
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3', className)}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-2.5 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}
