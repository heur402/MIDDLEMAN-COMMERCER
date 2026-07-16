import { cn } from '../../utils/cn'

const variants = {
  default:   'bg-gray-100 text-gray-700',
  primary:   'bg-orange-100 text-orange-700',
  success:   'bg-green-100 text-green-700',
  warning:   'bg-yellow-100 text-yellow-700',
  danger:    'bg-red-100 text-red-700',
  info:      'bg-blue-100 text-blue-700',
  sale:      'bg-red-500 text-white',
  new:       'bg-orange-500 text-white',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

/** Map order status string to a badge variant */
export function statusVariant(status) {
  const map = {
    pending:    'warning',
    confirmed:  'info',
    shipped:    'primary',
    delivered:  'success',
    completed:  'success',
    cancelled:  'danger',
    open:       'warning',
    under_review: 'info',
    resolved:   'success',
    closed:     'default',
  }
  return map[status] ?? 'default'
}
