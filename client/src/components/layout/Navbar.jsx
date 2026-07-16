import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ShoppingCart, MessageCircle, User, Menu, X,
  ChevronDown, Store, LayoutDashboard, LogOut, Package,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Row 1: Logo + Search + Actions */}
          <div className="flex items-center gap-3 h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 shrink-0">
              <span className="text-orange-500 font-black text-xl tracking-tight">
                Middle<span className="text-gray-900">Man</span>
              </span>
            </Link>

            {/* Search bar — hidden on mobile, shown md+ */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent"
            >
              <input
                type="text"
                placeholder="Search products, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm outline-none bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-1">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label={`Cart (${totalItems} items)`}
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold px-1">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Messages */}
              {isAuthenticated && (
                <Link
                  to="/messages"
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Messages"
                >
                  <MessageCircle size={22} />
                </Link>
              )}

              {/* Auth / User menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.[0]?.toUpperCase()}
                      </span>
                    )}
                    <ChevronDown size={14} className="text-gray-500 hidden md:block" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <MenuLink to="/dashboard" icon={LayoutDashboard} label="My Dashboard" onClick={() => setUserMenuOpen(false)} />
                        <MenuLink to="/orders" icon={Package} label="My Orders" onClick={() => setUserMenuOpen(false)} />
                        {isSeller && (
                          <MenuLink to="/seller/dashboard" icon={Store} label="Seller Dashboard" onClick={() => setUserMenuOpen(false)} />
                        )}
                        {isAdmin && (
                          <MenuLink to="/admin" icon={ShieldCheck} label="Admin Panel" onClick={() => setUserMenuOpen(false)} />
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => { setUserMenuOpen(false); handleLogout() }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Row 2: Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden pb-2">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-orange-500 text-white"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Row 3: Category nav — desktop only */}
          <nav className="hidden md:flex items-center gap-6 pb-2 text-sm font-medium text-gray-600">
            <Link to="/browse" className="hover:text-orange-500 transition-colors">All Products</Link>
            <Link to="/browse?category=electronics" className="hover:text-orange-500 transition-colors">Electronics</Link>
            <Link to="/browse?category=clothing" className="hover:text-orange-500 transition-colors">Clothing</Link>
            <Link to="/browse?category=home" className="hover:text-orange-500 transition-colors">Home & Garden</Link>
            <Link to="/browse?category=beauty" className="hover:text-orange-500 transition-colors">Beauty</Link>
            <Link to="/browse?category=sports" className="hover:text-orange-500 transition-colors">Sports</Link>
            <Link to="/browse?condition=new" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">🔥 New Arrivals</Link>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            <MobileNavLink to="/browse" onClick={() => setMobileMenuOpen(false)}>All Products</MobileNavLink>
            <MobileNavLink to="/browse?category=electronics" onClick={() => setMobileMenuOpen(false)}>Electronics</MobileNavLink>
            <MobileNavLink to="/browse?category=clothing" onClick={() => setMobileMenuOpen(false)}>Clothing</MobileNavLink>
            <MobileNavLink to="/browse?category=home" onClick={() => setMobileMenuOpen(false)}>Home & Garden</MobileNavLink>
            <MobileNavLink to="/browse?category=beauty" onClick={() => setMobileMenuOpen(false)}>Beauty</MobileNavLink>
            <MobileNavLink to="/browse?category=sports" onClick={() => setMobileMenuOpen(false)}>Sports</MobileNavLink>
          </div>
        )}
      </header>

      {/* ── Mobile bottom tab bar ────────────────────────────────────── */}
      <MobileTabBar totalItems={totalItems} isAuthenticated={isAuthenticated} />
    </>
  )
}

function MenuLink({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
    >
      {Icon && <Icon size={15} />}
      {label}
    </Link>
  )
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-colors"
    >
      {children}
    </Link>
  )
}

function MobileTabBar({ totalItems, isAuthenticated }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 flex items-center justify-around h-14 safe-bottom">
      <TabItem to="/" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} label="Home" />
      <TabItem to="/browse" icon={<Search size={20} />} label="Browse" />
      <TabItem
        to="/cart"
        icon={
          <div className="relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-orange-500 text-white text-[9px] font-bold px-0.5">
                {totalItems}
              </span>
            )}
          </div>
        }
        label="Cart"
      />
      {isAuthenticated ? (
        <>
          <TabItem to="/messages" icon={<MessageCircle size={20} />} label="Messages" />
          <TabItem to="/dashboard" icon={<User size={20} />} label="Account" />
        </>
      ) : (
        <TabItem to="/login" icon={<User size={20} />} label="Account" />
      )}
    </div>
  )
}

function TabItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 hover:text-orange-500 transition-colors"
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
