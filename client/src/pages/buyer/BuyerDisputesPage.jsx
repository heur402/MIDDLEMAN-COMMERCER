import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import DisputeCard from '../../components/disputes/DisputeCard'
import { disputesApi } from '../../api/disputes.api'
import toast from 'react-hot-toast'

export default function BuyerDisputesPage() {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    disputesApi.getMyDisputes({ limit: 50 })
      .then(({ data }) => setDisputes(data.data ?? []))
      .catch(() => toast.error('Failed to load disputes'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">My Disputes</h1>
        {loading ? <p className="text-sm text-gray-500">Loading disputes...</p> : disputes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
            <AlertTriangle size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No disputes found.</p>
            <Link to="/orders" className="text-sm text-orange-500 hover:underline mt-2 inline-block">View orders</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {disputes.map((dispute) => <DisputeCard key={dispute._id} dispute={dispute} />)}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
