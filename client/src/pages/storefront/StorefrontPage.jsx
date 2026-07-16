import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Package, Calendar } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import ProductGrid from '../../components/products/ProductGrid'
import { PageSpinner } from '../../components/common/Spinner'
import { sellerApi } from '../../api/seller.api'
import { formatDate } from '../../utils/formatDate'

export default function StorefrontPage() {
  const { sellerId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sellerApi
      .getStorefront(sellerId)
      .then(({ data: d }) => setData(d.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [sellerId])

  if (loading) return <PageWrapper><PageSpinner /></PageWrapper>

  if (!data) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-gray-500">Storefront not found.</div>
      </PageWrapper>
    )
  }

  const { seller, products } = data

  return (
    <PageWrapper>
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black shrink-0">
            {seller.avatar ? (
              <img src={seller.avatar} alt={seller.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              seller.name?.[0]?.toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black">{seller.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-1 text-sm opacity-90">
              {seller.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-300 text-yellow-300" />
                  {seller.rating.toFixed(1)} ({seller.reviewCount ?? 0} reviews)
                </span>
              )}
              <span className="flex items-center gap-1">
                <Package size={14} />
                {products?.length ?? 0} active listings
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Joined {formatDate(seller.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">Products by {seller.name}</h2>
        {products?.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p>No active listings yet.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </PageWrapper>
  )
}
