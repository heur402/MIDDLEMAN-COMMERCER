import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Reusable dashboard sidebar nav.
 *
 * @param {Array<{ to: string, icon: Component, label: string, badge?: string | number }>} items
 * @param {string} title  Optional section heading
 */
export default function Sidebar({ items = [], title, className }) {
  return (
    <aside className={cn('w-56 shrink-0', className)}>
      {title && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">
          {title}
        </p>
      )}
      <nav className="flex flex-col gap-0.5">
        {items.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            {Icon && <Icon size={18} />}
            <span className="flex-1">{label}</span>
            {badge !== undefined && badge !== null && (
              <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold px-1">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
