import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit3, Trash2, Eye, Package } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Sidebar from '../../components/layout/Sidebar'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { productsApi } from '../../api/products.api'
import { formatCurrency } from '../../utils/formatCurrency'
import { TrendingUp, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

const SELLER_NAV = [
  { to: '/seller/dashboard', icon: TrendingUp, label: 'Overview' },
  { to: '/seller/listings', icon: Package, label: 'My Listings' },
  { to: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
]

export default function SellerListingsPage() {
  const [listings, setListings] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  function load(p = page) {
    setLoading(true)
    productsApi
      .getMyListings({ page: p, limit: 15 })
      .then(({ data }) => {
        setListings(data.data ?? [])
        setPagination(data.pagination ?? { page: 1, totalPages: 1 })
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id) {
    if (!confirm('Delete this listing?')) return
    try {
      await productsApi.remove(id)
      toast.success('Listing deleted')
      load()
    } catch {
      toast.error('Failed to delete listing')
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <Sidebar items={SELLER_NAV} title="Seller" className="hidden md:block" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
              <Button as={Link} to="/seller/listings/new" size="sm">
                <Plus size={15} /> New Listing
              </Button>
            </div>

            {loading ? (
              <PageSpinner />
            ) : listings.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No listings yet"
                description="Create your first product listing to start selling."
                action={<Button as={Link} to="/seller/listings/new"><Plus size={16} /> Create Listing</Button>}
              />
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <tr>
                        <th className="text-left px-4 py-3">Product</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell">Price</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell">Stock</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-right px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {listings.map((listing) => (
                        <tr key={listing._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                {listing.images?.[0] && (
                                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate max-w-[200px]">{listing.title}</p>
                                <p className="text-xs text-gray-500 capitalize">{listing.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell font-medium text-orange-500">
                            {formatCurrency(listing.price)}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={listing.stock === 0 ? 'text-red-500' : 'text-gray-700'}>
                              {listing.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={listing.status === 'published' ? 'success' : listing.status === 'draft' ? 'warning' : 'danger'}>
                              {listing.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                to={`/products/${listing._id}`}
                                className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                                title="View"
                              >
                                <Eye size={15} />
                              </Link>
                              <Link
                                to={`/seller/listings/${listing._id}/edit`}
                                className="p-1.5 rounded text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                                title="Edit"
                              >
                                <Edit3 size={15} />
                              </Link>
                              <button
                                onClick={() => handleDelete(listing._id)}
                                className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onChange={setPage}
                  className="mt-4"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
