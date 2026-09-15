import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search, ShoppingCart, MessageCircle, Menu, X,
  ChevronDown, Store, LogOut, Package, Home, Heart,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

// ─── Constants ──────────────────────────────────────────────
const CATEGORIES = [
  { label: 'All Products', path: '/browse' },
  { label: 'Electronics', path: '/browse?category=electronics' },
  { label: 'Clothing', path: '/browse?category=clothing' },
  { label: 'Home & Garden', path: '/browse?category=home' },
  { label: 'Beauty', path: '/browse?category=beauty' },
  { label: 'Sports', path: '/browse?category=sports' },
]

// ─── Main Component ──────────────────────────────────────────
export default function Navbar() {
  const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const userMenuRef = useRef(null)
  const searchInputRef = useRef(null)

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // ─── Handlers ──────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      if (searchInputRef.current) searchInputRef.current.blur()
    }
  }

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    navigate('/login')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setUserMenuOpen(false)
      setMobileMenuOpen(false)
    }
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : 'shadow-sm bg-white'
        } border-b border-gray-200/80`}
        onKeyDown={handleKeyDown}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* ── Row 1: Logo + Search + Actions ── */}
          <div className="flex items-center gap-3 h-14 sm:h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-1.5 shrink-0 group"
              aria-label="MiddleMan Home"
            >
              <span className="text-orange-500 font-black text-xl tracking-tight transition-transform duration-200 group-hover:scale-105">
                Middle<span className="text-gray-900">Man</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
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
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white transition-colors rounded-r-full"
                aria-label="Submit search"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-0.5">
              {/* Cart — always visible */}
              <ActionButton
                to="/cart"
                icon={ShoppingCart}
                label={`Cart (${totalItems} items)`}
                badge={totalItems}
              />

              {/* Seller browsing the store — show a back-to-dashboard pill */}
              {(isSeller || isAdmin) ? (
                <Link
                  to={isAdmin ? '/admin' : '/seller/dashboard'}
                  className="hidden sm:flex items-center gap-1.5 ml-2 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full transition-colors"
                >
                  <Store size={13} />
                  {isAdmin ? 'Admin Panel' : 'Seller Dashboard'}
                </Link>
              ) : (
                // Guest: show login / register CTAs
                <div className="flex items-center gap-1 ml-2">
                  <Link
                    to="/track-order"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-orange-500 border border-gray-200 rounded-full transition-colors"
                  >
                    <Package size={13} /> Track Order
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors rounded-full"
                  >
                    Seller Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors shadow-sm hover:shadow-md"
                  >
                    Sell on MiddleMan
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
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
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-r-full"
                aria-label="Submit search"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* ── Row 3: Category Navigation ── */}
          <nav 
            className="hidden md:flex items-center gap-1 pb-3 text-sm font-medium text-gray-600 overflow-x-auto scrollbar-hide"
            aria-label="Categories"
          >
            {CATEGORIES.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-1.5 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors whitespace-nowrap ${
                  location.pathname === '/browse' && location.search === path.split('?')[1] 
                    ? 'text-orange-600 bg-orange-50' 
                    : ''
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/browse?condition=new"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
            >
              🔥 New Arrivals
            </Link>
          </nav>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 shadow-lg animate-slideDown"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {CATEGORIES.map(({ label, path }) => (
              <MobileNavLink key={path} to={path}>
                {label}
              </MobileNavLink>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <MobileNavLink to="/browse?condition=new" highlight>
                🔥 New Arrivals
              </MobileNavLink>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Tab Bar ── */}
      <MobileTabBar totalItems={totalItems} />
    </>
  )
}

// ─── Sub-Components ──────────────────────────────────────────

function ActionButton({ to, icon: Icon, label, badge }) {
  return (
    <Link
      to={to}
      className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors group"
      aria-label={label}
    >
      <Icon size={22} className="group-hover:scale-105 transition-transform" />
      {badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold px-1.5 shadow-sm animate-pulse">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

function MenuLink({ to, icon: Icon, label, onClick, highlight }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${
        highlight ? 'bg-orange-50 text-orange-600 font-medium' : ''
      }`}
      role="menuitem"
    >
      <Icon size={16} />
      {label}
    </Link>
  )
}

function MobileNavLink({ to, children, highlight, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
        highlight
          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600'
          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileTabBar({ totalItems }) {
  const location = useLocation()

  const tabs = [
    { to: '/',        icon: Home,         label: 'Home',   matchPaths: ['/'] },
    { to: '/browse',  icon: Search,       label: 'Browse', matchPaths: ['/browse'] },
    { to: '/cart',    icon: ShoppingCart, label: 'Cart',   badge: totalItems, matchPaths: ['/cart'] },
    { to: '/track-order', icon: Package,  label: 'Track',  matchPaths: ['/track-order'] },
    { to: '/login',   icon: Store,        label: 'Sell',   matchPaths: ['/login', '/register'] },
  ]

  const isTabActive = (tab) =>
    tab.matchPaths.some((p) => location.pathname === p)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 flex items-center justify-around h-16 safe-bottom shadow-lg"
      role="navigation"
      aria-label="Bottom navigation"
    >
      {tabs.map((tab) => {
        const isActive = isTabActive(tab)
        const Icon = tab.icon
        
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 transition-all duration-200 relative min-w-[56px] ${
              isActive ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="relative">
              <Icon 
                size={22} 
                className={`transition-all duration-200 ${
                  isActive ? 'scale-110' : ''
                }`} 
              />
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-orange-500 text-white text-[9px] font-bold px-1 shadow-sm">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium transition-colors duration-200 ${
              isActive ? 'text-orange-500' : 'text-gray-500'
            }`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -top-0.5 w-6 h-0.5 bg-orange-500 rounded-full" />
            )}
          </Link>
        )
      })}
    </div>
  )
}