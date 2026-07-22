import { DollarSign, TrendingUp, ShoppingBag, Clock } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

export default function EarningsSummary({ data = {}, loading = false }) {
  const stats = [
    { label: 'Total Earnings',  value: formatCurrency(data.totalEarnings  ?? 0), icon: DollarSign,  color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Pending Payout',  value: formatCurrency(data.pendingEarnings ?? 0), icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Orders',    value: data.totalOrders   ?? 0,                   icon: ShoppingBag, color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: 'Pending Orders',  value: data.pendingOrders ?? 0,                   icon: TrendingUp,  color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
          <div className={`p-2 rounded-full bg-white/70 ${s.color}`}>
            <s.icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 truncate">{s.label}</p>
            <p className={`text-lg font-black ${loading ? 'animate-pulse bg-gray-200 rounded h-6 w-16' : ''}`}>
              {!loading && s.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
