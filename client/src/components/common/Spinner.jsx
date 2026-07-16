import { cn } from '../../utils/cn'

const sizes = {
  sm:  'h-4 w-4 border-2',
  md:  'h-6 w-6 border-2',
  lg:  'h-10 w-10 border-4',
  xl:  'h-16 w-16 border-4',
}

export default function Spinner({ size = 'md', className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-current border-r-transparent animate-spin',
        sizes[size],
        className
      )}
    />
  )
}

/** Full-page centered spinner */
export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" className="text-orange-500" />
    </div>
  )
}
