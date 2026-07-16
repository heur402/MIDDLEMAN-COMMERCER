import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import ProductGrid from '../components/products/ProductGrid'
import ProductFilters from '../components/products/ProductFilters'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import { productsApi } from '../api/products.api'

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Derive filters from URL params
  const filters = {
    category: searchParams.get('category') ?? undefined,
    condition: searchParams.get('condition') ?? undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: searchParams.get('sort') ?? 'newest',
    q: searchParams.get('q') ?? undefined,
  }
  const page = Number(searchParams.get('page') ?? 1)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { ...filters, page, limit: 20 }
      // Remove undefined keys
      Object.keys(params).forEach((k) => params[k] === undefined && delete params[k])
      const { data } = await (filters.q
        ? productsApi.search(params)
        : productsApi.list(params))
      setProducts(data.data ?? [])
      setPagination(data.pagination ?? { page: 1, totalPages: 1, total: 0 })
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function handleFiltersChange(newFilters) {
    const next = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) next.set(k, v)
    })
    next.set('page', '1')
    setSearchParams(next)
  }

  function handlePageChange(p) {
    const next = new URLSearchParams(searchParams)
    next.set('page', p)
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {filters.q ? `Search: "${filters.q}"` : filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}` : 'All Products'}
            </h1>
            {!loading && (
              <p className="text-sm text-gray-500">
                {pagination.total.toLocaleString()} product{pagination.total !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {filtersOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
            Filters
          </button>
        </div>

        <div className="flex gap-5">
          {/* Sidebar filters — desktop always visible */}
          <div className={`shrink-0 w-52 ${filtersOpen ? 'block' : 'hidden'} md:block`}>
            <ProductFilters filters={filters} onChange={handleFiltersChange} />
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {!loading && products.length === 0 ? (
              <EmptyState
                icon={SlidersHorizontal}
                title="No products found"
                description="Try adjusting your filters or search term."
              />
            ) : (
              <>
                <ProductGrid products={products} loading={loading} />
                <div className="mt-6">
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
