import { cn } from '../../utils/cn'
import Spinner from './Spinner'

const variants = {
  primary:   'bg-orange-500 hover:bg-orange-600 text-white shadow-sm',
  secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  ghost:     'hover:bg-gray-100 text-gray-700',
  link:      'text-orange-500 hover:underline p-0',
}

const sizes = {
  xs:  'px-2.5 py-1 text-xs rounded',
  sm:  'px-3 py-1.5 text-sm rounded-md',
  md:  'px-4 py-2 text-sm rounded-md',
  lg:  'px-5 py-2.5 text-base rounded-lg',
  xl:  'px-6 py-3 text-lg rounded-lg',
}

/**
 * Reusable button component.
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'|'link'} variant
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size
 * @param {boolean} loading  Show spinner and disable interaction
 * @param {boolean} fullWidth  Make button take full container width
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}
