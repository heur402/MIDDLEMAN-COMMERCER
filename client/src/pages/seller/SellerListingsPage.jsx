import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit3, Trash2, Eye, Package } from 'lucide-react'
import SellerLayout from '../../components/layout/SellerLayout'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import DocxImportButton from '../../components/common/DocxImportButton'
import { productsApi } from '../../api/products.api'
import { sellerApi } from '../../api/seller.api'
import { formatCurrency } from '../../utils/formatCurrency'
import toast from 'react-hot-toast'

export default function SellerListingsPage() {
  const [listings, setListings]     = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [importResult, setImportResult] = useState(null)

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

  async function handleBulkImport(file) {
    const fd = new FormData()
    fd.append('file', file)
    try {
      const { data } = await sellerApi.bulkImportListings(fd)
      toast.success(data.message)
      setImportResult(data.data)
      load(1)
      setPage(1)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Import failed')
    }
  }

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <DocxImportButton
              onDownloadTemplate={sellerApi.downloadListingsTemplate}
              templateFilename="listings_template.docx"
              onUpload={handleBulkImport}
              label="Bulk Import"
            />
            <Button as={Link} to="/seller/listings/new" size="sm">
              <Plus size={15} /> New Listing
            </Button>
          </div>
        </div>

        {/* Import result summary */}
        {importResult && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Import complete — {importResult.created} listing(s) created as drafts
                </p>
                {importResult.errors?.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {importResult.errors.map((e, i) => (
                      <li key={i} className="text-xs text-red-600">• {e}</li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-blue-600 mt-2">Add images to each listing by clicking Edit.</p>
              </div>
              <button onClick={() => setImportResult(null)} className="text-blue-400 hover:text-blue-600 text-lg leading-none">×</button>
            </div>
          </div>
        )}

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
                            {listing.images?.[0] ? (
                              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{listing.title}</p>
                            <p className="text-xs text-gray-500 capitalize">{listing.category?.name ?? listing.category}</p>
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
                          <a
                            href={`/products/${listing._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                            title="View on store"
                          >
                            <Eye size={15} />
                          </a>
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
    </SellerLayout>
  )
}
