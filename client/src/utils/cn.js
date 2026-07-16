import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names safely, resolving conflicts.
 * Usage: cn('px-4 py-2', condition && 'bg-orange-500', 'bg-red-500')
 * → 'px-4 py-2 bg-red-500'
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
