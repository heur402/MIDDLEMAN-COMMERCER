import { useState } from 'react'
import StarRating from '../common/StarRating'
import Button from '../common/Button'
import Textarea from '../common/Textarea'
import { reviewsApi } from '../../api/reviews.api'
import toast from 'react-hot-toast'

/**
 * Review form shown after an order reaches 'completed' status.
 *
 * @param {string}   orderId
 * @param {string}   productId
 * @param {string}   sellerName
 * @param {function} onSuccess   Called after successful submission
 */
export default function ReviewForm({ orderId, productId, sellerName, onSuccess }) {
  const [rating, setRating]   = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating === 0) { toast.error('Please select a star rating'); return }

    setLoading(true)
    try {
      await reviewsApi.create({ orderId, productId, rating, comment })
      toast.success('Review submitted – thank you!')
      onSuccess?.()
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Rate your experience with <span className="text-orange-500">{sellerName}</span>
        </p>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}
      </div>

      <Textarea
        label="Your review (optional)"
        placeholder="Describe your experience with the product and seller..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        maxLength={1000}
      />
      <p className="text-xs text-gray-400 text-right">{comment.length}/1000</p>

      <Button type="submit" loading={loading} fullWidth>
        Submit Review
      </Button>
    </form>
  )
}
