import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge, { statusVariant } from '../../components/common/Badge'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { adminApi } from '../../api/admin.api'
import toast from 'react-hot-toast'

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [resolution, setResolution] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  function load() {
    setLoading(true)
    adminApi.getDisputes(status ? { status, limit: 50 } : { limit: 50 })
      .then(({ data }) => setDisputes(data.data ?? []))
      .catch(() => toast.error('Failed to load disputes'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [status])

  async function updateDispute(e) {
    e.preventDefault()
    try {
      await adminApi.updateDispute(editing._id, { status: editing.nextStatus, resolution, adminNotes })
      toast.success('Dispute updated')
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update dispute')
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Disputes</h1>
          <p className="text-sm text-gray-500">Review and resolve order disputes.</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="under_review">Under review</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      {loading ? <p className="text-sm text-gray-500">Loading disputes...</p> : disputes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-sm text-gray-500">No disputes found.</div>
      ) : (
        <div className="space-y-3">
          {disputes.map((dispute) => (
            <div key={dispute._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">Order #{dispute.orderId?._id?.slice(-8).toUpperCase()}</p>
                  <p className="font-semibold text-gray-900 mt-1">{dispute.reason}</p>
                  <p className="text-xs text-gray-500 mt-2">Raised by {dispute.raisedBy?.name ?? 'user'}</p>
                </div>
                <Badge variant={statusVariant(dispute.status)}>{dispute.status}</Badge>
              </div>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => {
                setEditing({ ...dispute, nextStatus: dispute.status === 'open' ? 'under_review' : dispute.status })
                setResolution(dispute.resolution ?? '')
                setAdminNotes(dispute.adminNotes ?? '')
              }}>Review</Button>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <form onSubmit={updateDispute} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
            <h2 className="font-bold text-gray-900">Review dispute</h2>
            <select value={editing.nextStatus} onChange={(e) => setEditing({ ...editing, nextStatus: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="under_review">Under review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <Input label="Resolution" value={resolution} onChange={(e) => setResolution(e.target.value)} />
            <Input label="Admin notes" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit">Save update</Button>
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  )
}
