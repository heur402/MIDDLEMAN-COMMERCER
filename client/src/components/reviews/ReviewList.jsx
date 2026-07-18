import { useState, useEffect } from 'react'
import StarRating from '../common/StarRating'
import { PageSpinner } from '../common/Spinner'
import EmptyState from '../common/EmptyState'
import Pagination from '../common/Pagination'
import { reviewsApi } from '../../api/reviews.api'
import { formatRelativeTime } from '../../utils/formatDate'
import { MessageSquare } from 'lucide-react'

/**
 * Display a paginated list of reviews for a seller or product.
 *
 * @param {'seller'|'product'} type
 * @param {string}             targetId  sellerId or productId
 */
export default function ReviewList({ type = 'seller', targetId }) {
  const [reviews, setReviews]     = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!targetId) return
    setLoading(true)
    const fetcher =
      type === 'seller'
        ? reviewsApi.forSeller(targetId, { page, limit: 10 })
        : reviewsApi.forProduct(targetId, { page, limit: 10 })

    fetcher
      .then(({ data }) => {
        setReviews(data.data ?? [])
        setPagination(data.pagination ?? { page: 1, totalPages: 1 })
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [type, targetId, page])

  if (loading) return <PageSpinner />

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No reviews yet"
        description="Reviews from buyers will appear here after completed orders."
      />
    )
  }

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div className="space-y-4">
      {/* Average rating summary */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <span className="text-4xl font-black text-gray-900">{avgRating.toFixed(1)}</span>
        <div>
          <StarRating value={Math.round(avgRating)} readOnly size="md" />
          <p className="text-xs text-gray-500 mt-0.5">{pagination.total ?? reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Review cards */}
      {reviews.map((review) => (
        <div key={review._id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
            {review.reviewerId?.name?.[0]?.toUpperCase() ?? '?'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-sm font-semibold text-gray-900">
                {review.reviewerId?.name ?? 'Buyer'}
              </span>
              <span className="text-xs text-gray-400">{formatRelativeTime(review.createdAt)}</span>
            </div>
            <StarRating value={review.rating} readOnly size="sm" />
            {review.comment && (
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{review.comment}</p>
            )}
          </div>
        </div>
      ))}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
    </div>
  )
}
