import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from '../common/Button'
import Textarea from '../common/Textarea'
import { disputesApi } from '../../api/disputes.api'
import toast from 'react-hot-toast'

export default function DisputeForm({ orderId, onSuccess }) {
  const [reason, setReason]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (reason.trim().length < 20) {
      toast.error('Please describe the issue in at least 20 characters')
      return
    }
    setLoading(true)
    try {
      await disputesApi.raise({ orderId, reason: reason.trim() })
      toast.success('Dispute raised — our team will review it shortly.')
      onSuccess?.()
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to raise dispute')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <AlertTriangle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-800">
          Raising a dispute pauses the order and notifies our support team. Be as detailed as possible.
        </p>
      </div>
      <Textarea
        label="Describe the issue"
        required
        placeholder="e.g. Item received is different from the listing description..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={5}
        maxLength={2000}
        helperText={`${reason.length}/2000 (minimum 20 characters)`}
      />
      <Button type="submit" variant="danger" loading={loading} fullWidth>
        <AlertTriangle size={15} />
        Raise Dispute
      </Button>
    </form>
  )
}
