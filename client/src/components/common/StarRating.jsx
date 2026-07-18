import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Interactive star rating input.
 *
 * @param {number}   value      Current rating (1-5)
 * @param {function} onChange   Called with new rating value
 * @param {boolean}  readOnly   Display-only mode (no interaction)
 * @param {'sm'|'md'|'lg'} size
 */
export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0)

  const sizes = { sm: 14, md: 20, lg: 28 }
  const px = sizes[size] ?? 20

  const display = readOnly ? value : (hovered || value)

  return (
    <div
      className={cn('flex items-center gap-0.5', !readOnly && 'cursor-pointer')}
      onMouseLeave={() => !readOnly && setHovered(0)}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          className={cn(
            'transition-transform',
            !readOnly && 'hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded'
          )}
        >
          <Star
            size={px}
            className={cn(
              'transition-colors',
              star <= display
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        </button>
      ))}
    </div>
  )
}
