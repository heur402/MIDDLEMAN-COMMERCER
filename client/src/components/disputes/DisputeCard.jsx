import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import Badge, { statusVariant } from '../common/Badge'
import { formatDate } from '../../utils/formatDate'

const STATUS_LABELS = {
  open:         'Open',
  under_review: 'Under Review',
  resolved:     'Resolved',
  closed:       'Closed',
}

export default function DisputeCard({ dispute, href }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 rounded-full bg-red-50 shrink-0">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium">
              Order #{dispute.orderId?.toString().slice(-8).toUpperCase() ?? '—'}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2">
              {dispute.reason}
            </p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(dispute.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={statusVariant(dispute.status)}>
            {STATUS_LABELS[dispute.status] ?? dispute.status}
          </Badge>
          {href && (
            <Link to={href} className="text-gray-400 hover:text-orange-500 transition-colors">
              <ChevronRight size={18} />
            </Link>
          )}
        </div>
      </div>
      {dispute.resolution && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Resolution</p>
          <p className="text-sm text-gray-700">{dispute.resolution}</p>
        </div>
      )}
    </div>
  )
}
