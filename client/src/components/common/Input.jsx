import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * Controlled text input with label, error, and optional leading/trailing icon slots.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    className,
    containerClassName,
    required,
    ...props
  },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {LeadingIcon && (
          <span className="absolute left-3 text-gray-400 pointer-events-none">
            <LeadingIcon size={16} />
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-400',
            LeadingIcon && 'pl-9',
            TrailingIcon && 'pr-9',
            className
          )}
          {...props}
        />
        {TrailingIcon && (
          <span className="absolute right-3 text-gray-400 pointer-events-none">
            <TrailingIcon size={16} />
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
})

export default Input
