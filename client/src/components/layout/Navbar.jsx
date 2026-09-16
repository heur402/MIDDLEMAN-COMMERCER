import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X, Store, Package, Home, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useNotifications } from '../../context/NotificationContext'

const CATEGORIES = [
  { label: 'All Products', path: '/browse' },
  { label: 'Electronics',  path: '/browse?category=electronics' },
  { label: 'Clothing',     path: '/browse?category=clothing' },
  { label: 'Home & Garden',path: '/browse?category=home' },
  { label: 'Beauty',       path: '/browse?category=beauty' },
  { label: 'Sports',       path: '/browse?category=sports' },
]

export default function Navbar() {
  const { isSeller, isAdmin, isAuthenticated } = useAuth()
  const { totalItems } = useCart()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery]       = useState('')
  const [scrolled, setScrolled]             = useState(false)
  const searchInputRef                      = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileMenuOpen(false) }, [location.pathname])

  function handleSearch(e) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
    searchInputRef.current?.blur()
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b border-gray-200/80 ${
          scrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : 'shadow-sm bg-white'
        }`}
        onKeyDown={(e) => e.key === 'Escape' && setMobileMenuOpen(false)}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── Row 1: Logo + Search + Actions ── */}
          <div className="flex items-center gap-3 h-14 sm:h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 shrink-0 group" aria-label="MiddleMan Home">
              <span className="text-orange-500 font-black text-xl tracking-tight group-hover:scale-105 transition-transform">
                Middle<span className="text-gray-900">Man</span>
              </span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold px-1.5 shadow-sm">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Search — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-orange-400 focus-within:shadow-md transition-all duration-200"
              role="search"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, sellers, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-2.5 text-sm outline-none bg-transparent"
                aria-label="Search"
              />
              <button type="submit" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white transition-colors rounded-r-full" aria-label="Submit search">
                <Search size={18} />
              </button>
            </form>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-1">

              {/* Cart — always visible */}
              <Link to="/cart" className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors" aria-label={`Cart (${totalItems} items)`}>
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold px-1.5 shadow-sm">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Seller/admin browsing the store — back-to-dashboard pill */}
              {(isSeller || isAdmin) ? (
                <Link
                  to={isAdmin ? '/admin' : '/seller/dashboard'}
                  className="hidden sm:flex items-center gap-1.5 ml-1 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full transition-colors"
                >
                  <Store size={13} />
                  {isAdmin ? 'Admin Panel' : 'Seller Dashboard'}
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-1 ml-1">
                  <Link
                    to="/track-order"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-orange-500 border border-gray-200 rounded-full transition-colors"
                  >
                    <Package size={13} /> Track Order
                  </Link>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors rounded-full">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors shadow-sm">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* ── Row 2: Mobile Search ── */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-orange-400 transition-all">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
                aria-label="Search"
              />
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-r-full" aria-label="Submit search">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* ── Row 3: Category nav — desktop ── */}
          <nav className="hidden md:flex items-center gap-1 pb-3 text-sm font-medium text-gray-600 overflow-x-auto" aria-label="Categories">
            {CATEGORIES.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="px-4 py-1.5 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/browse?condition=new"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm whitespace-nowrap"
            >
              🔥 New Arrivals
            </Link>
          </nav>
        </div>

        {/* ── Mobile dropdown menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 shadow-lg" role="navigation" aria-label="Mobile navigation">
            {CATEGORIES.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/browse?condition=new"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white"
            >
              🔥 New Arrivals
            </Link>

            {/* Mobile: seller back-to-dashboard or login CTAs */}
            <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
              {(isSeller || isAdmin) ? (
                <Link
                  to={isAdmin ? '/admin' : '/seller/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-orange-600 bg-orange-50 rounded-xl"
                >
                  <Store size={15} />
                  {isAdmin ? 'Admin Panel' : 'Seller Dashboard'}
                </Link>
              ) : (
                <>
                  <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50">
                    Track My Order
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-semibold rounded-xl bg-orange-500 text-white text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile bottom tab bar ── */}
      <MobileTabBar totalItems={totalItems} isSeller={isSeller} isAdmin={isAdmin} />
    </>
  )
}

function MobileTabBar({ totalItems, isSeller, isAdmin }) {
  const location = useLocation()

  const tabs = [
    { to: '/',            icon: Home,         label: 'Home',   matchPaths: ['/'] },
    { to: '/browse',      icon: Search,       label: 'Browse', matchPaths: ['/browse'] },
    { to: '/cart',        icon: ShoppingCart, label: 'Cart',   badge: totalItems, matchPaths: ['/cart'] },
    { to: '/track-order', icon: Package,      label: 'Track',  matchPaths: ['/track-order'] },
    {
      to: (isAdmin ? '/admin' : isSeller ? '/seller/dashboard' : '/login'),
      icon: Store,
      label: (isAdmin ? 'Admin' : isSeller ? 'Dashboard' : 'Sell'),
      matchPaths: ['/login', '/register', '/seller/dashboard', '/admin'],
    },
  ]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 flex items-center justify-around h-16 shadow-lg"
      role="navigation"
      aria-label="Bottom navigation"
    >
      {tabs.map((tab) => {
        const isActive = tab.matchPaths.some((p) => location.pathname === p)
        const Icon = tab.icon
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 relative min-w-[56px] transition-colors ${
              isActive ? 'text-orange-500' : 'text-gray-500'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="relative">
              <Icon size={22} className={isActive ? 'scale-110' : ''} />
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-orange-500 text-white text-[9px] font-bold px-1">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
            {isActive && <span className="absolute -top-0.5 w-6 h-0.5 bg-orange-500 rounded-full" />}
          </Link>
        )
      })}
    </div>
  )
}
