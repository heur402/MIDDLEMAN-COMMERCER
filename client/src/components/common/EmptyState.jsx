import { cn } from '../../utils/cn'

/**
 * Generic empty-state placeholder.
 *
 * @param {React.ComponentType} icon  Lucide icon component
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} action    Optional CTA (e.g. a <Button>)
 */
export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {Icon && (
        <div className="mb-4 p-4 rounded-full bg-gray-100">
          <Icon size={40} className="text-gray-400" />
        </div>
      )}
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
      {description && <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}
