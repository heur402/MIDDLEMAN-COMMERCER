import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Package, AlertTriangle, TrendingUp, Tag, ShieldAlert, Eye, EyeOff, Search
} from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import { PageSpinner } from '../../components/common/Spinner'
import { adminApi } from '../../api/admin.api'
import Button from '../../components/common/Button'
import Pagination from '../../components/common/Pagination'
import { formatCurrency } from '../../utils/formatCurrency'
import toast from 'react-hot-toast'

const ADMIN_NAV = [
  { to: '/admin',          icon: TrendingUp,   label: 'Overview'   },
  { to: '/admin/users',    icon: Users,        label: 'Users'      },
  { to: '/admin/listings', icon: Package,      label: 'Listings'   },
  { to: '/admin/disputes', icon: AlertTriangle,label: 'Disputes'   },
  { to: '/admin/categories',icon: Tag,          label: 'Categories' },
]

export default function AdminListingsPage() {
  const [listings, setListings] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    fetchListings()
  }, [page, q])

  async function fetchListings() {
    setLoading(true)
    try {
      const { data } = await adminApi.getListings({ page, limit: 10, q })
      setListings(data.data ?? [])
      setPagination(data.pagination ?? { page: 1, totalPages: 1 })
    } catch {
      toast.error('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    setQ(searchVal)
    setPage(1)
  }

  async function handleDeactivate(id) {
    if (!window.confirm('Are you sure you want to deactivate this listing? It will no longer be visible on the store.')) {
      return
    }
    try {
      await adminApi.deactivateListing(id)
      toast.success('Listing deactivated')
      fetchListings()
    } catch {
      toast.error('Failed to deactivate listing')
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-52 shrink-0 gap-0.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">Admin</p>
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  to === '/admin/listings'
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Moderate Listings</h1>
                <p className="text-sm text-gray-500">Deactivate products that violate marketplace rules</p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <Button type="submit" size="sm">
                  <Search size={15} /> Search
                </Button>
              </form>
            </div>

            {loading ? <PageSpinner /> : (
              <>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Seller</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Stock</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {listings.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                              No listings found.
                            </td>
                          </tr>
                        ) : (
                          listings.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                    {item.images?.[0] ? (
                                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs bg-gray-200">
                                        No Image
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <Link to={`/products/${item._id}`} className="font-semibold text-gray-900 hover:text-orange-500 hover:underline line-clamp-1">
                                      {item.title}
                                    </Link>
                                    <span className="text-[10px] text-gray-400 font-mono block truncate">{item._id}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs">
                                <p className="font-medium text-gray-800">{item.sellerId?.name || 'Unknown'}</p>
                                <p className="text-gray-400 font-mono truncate">{item.sellerId?.email}</p>
                              </td>
                              <td className="px-6 py-4 font-bold text-orange-500">{formatCurrency(item.price)}</td>
                              <td className="px-6 py-4 font-mono text-xs">{item.stock}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === 'published'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : item.status === 'draft'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {item.status !== 'inactive' ? (
                                  <button
                                    onClick={() => handleDeactivate(item._id)}
                                    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium rounded-lg text-xs transition-colors"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400 italic">Inactive</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      page={pagination.page}
                      totalPages={pagination.totalPages}
                      onChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
