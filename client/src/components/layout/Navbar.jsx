import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search, ShoppingCart, MessageCircle, User, Menu, X,
  ChevronDown, Store, LayoutDashboard, LogOut, Package,
  ShieldCheck, Home, Heart, Settings,
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

const QUICK_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/orders', icon: Package, label: 'My Orders' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/settings', icon: Settings, label: 'Settings' },
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
    navigate('/')
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
              {/* Wishlist */}
              {isAuthenticated && (
                <ActionButton to="/wishlist" icon={Heart} label="Wishlist" />
              )}

              {/* Cart */}
              <ActionButton
                to="/cart"
                icon={ShoppingCart}
                label={`Cart (${totalItems} items)`}
                badge={totalItems}
              />

              {/* Messages */}
              {isAuthenticated && (
                <ActionButton to="/messages" icon={MessageCircle} label="Messages" />
              )}

              {/* Auth / User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 ${
                      userMenuOpen ? 'bg-gray-100' : ''
                    }`}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-200"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                    <ChevronDown 
                      size={14} 
                      className={`text-gray-500 hidden sm:block transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100/80 py-2 z-20 animate-slideDown origin-top-right"
                      role="menu"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        {user?.role && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-700 rounded-full">
                            {user.role}
                          </span>
                        )}
                      </div>

                      {/* Quick Links */}
                      {QUICK_LINKS.map(({ to, icon: Icon, label }) => (
                        <MenuLink
                          key={to}
                          to={to}
                          icon={Icon}
                          label={label}
                          onClick={() => setUserMenuOpen(false)}
                        />
                      ))}

                      {/* Seller/Admin Links */}
                      {(isSeller || isAdmin) && (
                        <div className="border-t border-gray-100 my-1 pt-1">
                          {isSeller && (
                            <MenuLink
                              to="/seller/dashboard"
                              icon={Store}
                              label="Seller Dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              highlight
                            />
                          )}
                          {isAdmin && (
                            <MenuLink
                              to="/admin"
                              icon={ShieldCheck}
                              label="Admin Panel"
                              onClick={() => setUserMenuOpen(false)}
                              highlight
                            />
                          )}
                        </div>
                      )}

                      {/* Logout */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          role="menuitem"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 ml-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors rounded-full"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors shadow-sm hover:shadow-md"
                  >
                    Register
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
      <MobileTabBar 
        totalItems={totalItems} 
        isAuthenticated={isAuthenticated} 
      />
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

// ─── Fixed MobileTabBar ──────────────────────────────────────
function MobileTabBar({ totalItems, isAuthenticated }) {
  const location = useLocation()
  
  // Define all possible tabs with their paths
  const allTabs = [
    { 
      to: '/', 
      icon: Home, 
      label: 'Home',
      matchPaths: ['/']
    },
    { 
      to: '/browse', 
      icon: Search, 
      label: 'Browse',
      matchPaths: ['/browse']
    },
    { 
      to: '/cart', 
      icon: ShoppingCart, 
      label: 'Cart',
      badge: totalItems,
      matchPaths: ['/cart']
    },
  ]

  // Add conditional tabs
  if (isAuthenticated) {
    allTabs.push(
      { 
        to: '/messages', 
        icon: MessageCircle, 
        label: 'Chat',
        matchPaths: ['/messages']
      },
      { 
        to: '/dashboard', 
        icon: User, 
        label: 'Account',
        matchPaths: ['/dashboard', '/profile', '/settings', '/orders', '/wishlist']
      }
    )
  } else {
    allTabs.push(
      { 
        to: '/login', 
        icon: User, 
        label: 'Account',
        matchPaths: ['/login', '/register']
      }
    )
  }

  // Check if a tab is active
  const isTabActive = (tab) => {
    return tab.matchPaths.some(path => location.pathname === path) ||
           (tab.to === '/browse' && location.pathname === '/browse')
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 flex items-center justify-around h-16 safe-bottom shadow-lg"
      role="navigation"
      aria-label="Bottom navigation"
    >
      {allTabs.map((tab) => {
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