import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  TrendingUp, Package, ShoppingBag, LogOut, Menu, Store, Plus,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'

const NAV = [
  { to: '/seller/dashboard',      icon: TrendingUp,  label: 'Overview'    },
  { to: '/seller/listings',       icon: Package,     label: 'My Listings' },
  { to: '/seller/listings/new',   icon: Plus,        label: 'New Listing', highlight: true },
  { to: '/seller/orders',         icon: ShoppingBag, label: 'Orders'      },
]

export default function SellerLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col w-60 bg-white border-r border-gray-100 transition-transform duration-200',
          'md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-100 shrink-0">
          <Store size={20} className="text-orange-500" />
          <span className="font-black text-lg text-gray-900">
            Middle<span className="text-orange-500">Man</span>
          </span>
          <span className="ml-auto text-[10px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
            Seller
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
            Dashboard
          </p>
          {NAV.map(({ to, icon: Icon, label, highlight }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  highlight && !isActive
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-gray-100 shrink-0 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar (mobile only) */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-100 shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-black text-base text-gray-900">
            Middle<span className="text-orange-500">Man</span>
          </span>
          <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
            Seller
          </span>
          {/* Mobile quick-add button */}
          <NavLink
            to="/seller/listings/new"
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus size={14} /> New Listing
          </NavLink>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
