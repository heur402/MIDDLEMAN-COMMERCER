import { Check, Clock, Package, Truck, Home, CheckCheck } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'
import { cn } from '../../utils/cn'

const STEPS = [
  { status: 'pending',   label: 'Order Placed',   icon: Clock },
  { status: 'confirmed', label: 'Confirmed',       icon: Check },
  { status: 'shipped',   label: 'Shipped',         icon: Truck },
  { status: 'delivered', label: 'Delivered',       icon: Home },
  { status: 'completed', label: 'Completed',       icon: CheckCheck },
]

const ORDER_STATUS = ['pending', 'confirmed', 'shipped', 'delivered', 'completed']

export default function OrderTimeline({ status, timeline = [] }) {
  const currentIndex = ORDER_STATUS.indexOf(status)

  return (
    <div className="space-y-4">
      {/* Step progress bar */}
      <div className="flex items-center justify-between relative">
        {/* connector line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0" />

        {STEPS.map((step, i) => {
          const done = i <= currentIndex
          const active = i === currentIndex
          const Icon = step.icon
          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                  done
                    ? active
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                )}
              >
                <Icon size={14} />
              </div>
              <span className={cn('text-[10px] font-medium hidden sm:block', done ? 'text-gray-800' : 'text-gray-400')}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Detailed timeline log */}
      {timeline.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Activity Log</h3>
          {[...timeline].reverse().map((entry, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-1 shrink-0" />
                {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
              </div>
              <div className="pb-3">
                <p className="text-sm font-medium text-gray-800 capitalize">{entry.status}</p>
                {entry.note && <p className="text-xs text-gray-500">{entry.note}</p>}
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.timestamp, { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
