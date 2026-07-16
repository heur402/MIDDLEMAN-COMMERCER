import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star, ShoppingCart, MessageCircle, Store, Package,
  ChevronRight, Shield,
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import ProductImageGallery from '../components/products/ProductImageGallery'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import { PageSpinner } from '../components/common/Spinner'
import { productsApi } from '../api/products.api'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import toast from 'react-hot-toast'

const CONDITION_LABELS = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    setLoading(true)
    productsApi
      .getById(id)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    addItem(product, qty)
    setAddedToCart(true)
    toast.success('Added to cart!')
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) return <PageWrapper><PageSpinner /></PageWrapper>

  if (!product) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Product not found</h2>
          <p className="text-gray-500 mt-2">This listing may have been removed.</p>
          <Link to="/browse" className="mt-4 inline-block text-orange-500 hover:underline">
            Browse other products
          </Link>
        </div>
      </PageWrapper>
    )
  }

  const seller = product.sellerId ?? {}

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight size={12} />
          <Link to="/browse" className="hover:text-orange-500">Products</Link>
          {product.category && (
            <>
              <ChevronRight size={12} />
              <Link to={`/browse?category=${product.category}`} className="hover:text-orange-500 capitalize">
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-gray-700 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductImageGallery images={product.images} />

          {/* Info panel */}
          <div className="space-y-5">
            {/* Title + badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="default" className="capitalize">{product.category}</Badge>
                <Badge variant={product.condition === 'new' ? 'new' : 'default'}>
                  {CONDITION_LABELS[product.condition] ?? product.condition}
                </Badge>
                {product.stock === 0 && <Badge variant="danger">Out of Stock</Badge>}
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount ?? 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-orange-500">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock */}
            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0
                ? product.stock < 10
                  ? `⚠️ Only ${product.stock} left in stock`
                  : `✓ ${product.stock} in stock`
                : '✗ Out of stock'}
            </p>

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Qty:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                variant={addedToCart ? 'secondary' : 'primary'}
              >
                <ShoppingCart size={18} />
                {addedToCart ? 'Added ✓' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="sm:w-auto"
                as={Link}
                to={`/messages?seller=${seller._id}`}
              >
                <MessageCircle size={18} />
                Message
              </Button>
            </div>

            {/* Buyer guarantee */}
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
              <Shield size={18} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Buyer Protection</p>
                <p className="text-xs text-green-700 mt-0.5">
                  Your payment is held safely until you confirm delivery.
                </p>
              </div>
            </div>

            {/* Seller card */}
            {seller._id && (
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Sold by</p>
                <Link
                  to={`/store/${seller._id}`}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors -m-1 p-1"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                    {seller.name?.[0]?.toUpperCase() ?? 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      {seller.name ?? 'Seller'}
                      <Store size={12} className="text-orange-500 ml-0.5" />
                    </p>
                    {seller.rating > 0 && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        {seller.rating.toFixed(1)} · {seller.reviewCount ?? 0} reviews
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/browse?q=${encodeURIComponent(tag)}`}
                    className="text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-600 px-2.5 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Product Description</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Listed on {formatDate(product.createdAt)}
          </p>
        </div>
      </div>
    </PageWrapper>
  )
}
