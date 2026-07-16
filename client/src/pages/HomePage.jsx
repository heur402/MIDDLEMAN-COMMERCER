import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Smartphone, Shirt, Home as HomeIcon, Sparkles, Dumbbell,
  Baby, BookOpen, Car, Grid2x2, Zap, ChevronRight, Clock,
  ArrowRight, Star, Shield, Truck, Headphones, Gift, 
  TrendingUp, Clock as ClockIcon, Award, Flame
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import ProductGrid from '../components/products/ProductGrid'
import { productsApi } from '../api/products.api'
import { countdown } from '../utils/formatDate'

// ── Category grid data ────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Electronics', value: 'electronics', icon: Smartphone, gradient: 'from-blue-400 to-blue-600' },
  { label: 'Clothing', value: 'clothing', icon: Shirt, gradient: 'from-pink-400 to-pink-600' },
  { label: 'Home', value: 'home', icon: HomeIcon, gradient: 'from-amber-400 to-amber-600' },
  { label: 'Beauty', value: 'beauty', icon: Sparkles, gradient: 'from-purple-400 to-purple-600' },
  { label: 'Sports', value: 'sports', icon: Dumbbell, gradient: 'from-emerald-400 to-emerald-600' },
  { label: 'Toys', value: 'toys', icon: Baby, gradient: 'from-rose-400 to-rose-600' },
  { label: 'Books', value: 'books', icon: BookOpen, gradient: 'from-indigo-400 to-indigo-600' },
  { label: 'Automotive', value: 'automotive', icon: Car, gradient: 'from-slate-400 to-slate-600' },
  { label: 'All', value: '', icon: Grid2x2, gradient: 'from-orange-400 to-orange-600' },
]

const FLASH_END = new Date(Date.now() + 8 * 60 * 60 * 1000)

// ─── Trust Badges ─────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Shield, title: 'Buyer Protection', desc: 'Payment held until delivery confirmed', color: 'text-emerald-600' },
  { icon: Truck, title: 'Easy Shipping', desc: 'Sellers handle shipping directly', color: 'text-blue-600' },
  { icon: Headphones, title: '24/7 Support', desc: 'We\'re here to help anytime', color: 'text-purple-600' },
  { icon: Star, title: 'Verified Reviews', desc: 'Only verified buyers can review', color: 'text-amber-600' },
]

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HomePage() {
  const [newProducts, setNewProducts] = useState([])
  const [flashProducts, setFlashProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingNew, setLoadingNew] = useState(true)
  const [loadingFlash, setLoadingFlash] = useState(true)
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [timer, setTimer] = useState(countdown(FLASH_END))

  // Countdown tick
  useEffect(() => {
    const id = setInterval(() => setTimer(countdown(FLASH_END)), 1000)
    return () => clearInterval(id)
  }, [])

  const fetchSection = useCallback(async (params, setter, setLoading) => {
    try {
      const { data } = await productsApi.list(params)
      setter(data.data ?? [])
    } catch {
      setter([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSection({ sort: 'newest', limit: 10 }, setNewProducts, setLoadingNew)
    fetchSection({ sort: 'price_asc', limit: 10 }, setFlashProducts, setLoadingFlash)
    fetchSection({ sort: 'rating', limit: 10 }, setFeaturedProducts, setLoadingFeatured)
  }, [fetchSection])

  return (
    <PageWrapper className="bg-gradient-to-b from-gray-50 to-white">
      {/* ── Hero Banner ── */}
      <HeroBanner />

      {/* ── Category Grid ── */}
      <CategoryGrid />

      {/* ── Flash Sale ── */}
      <FlashSaleSection 
        products={flashProducts} 
        loading={loadingFlash} 
        timer={timer} 
      />

      {/* ── New Arrivals ── */}
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh products just for you"
        icon={TrendingUp}
        to="/browse?sort=newest"
        products={newProducts}
        loading={loadingNew}
        gradient="from-blue-500 to-purple-600"
      />

      {/* ── Top Rated ── */}
      <ProductSection
        title="Top Rated"
        subtitle="Loved by our community"
        icon={Award}
        to="/browse?sort=rating"
        products={featuredProducts}
        loading={loadingFeatured}
        gradient="from-amber-500 to-orange-600"
      />

      {/* ── Trust Badges ── */}
      <TrustBadges />

      {/* ── CTA Banner ── */}
      <CTABanner />
    </PageWrapper>
  )
}

// ─── Hero Banner ────────────────────────────────────────────────────────────
function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600">
      {/* Animated background shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 lg:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Trusted Marketplace
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Buy & Sell with
              <br />
              <span className="text-yellow-300 drop-shadow-lg">Full Confidence</span>
            </h1>

            <p className="text-lg md:text-xl opacity-90 max-w-md leading-relaxed">
              We own the transaction lifecycle — your payment is protected until you confirm delivery.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/browse"
                className="group px-8 py-3.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-3.5 border-2 border-white/70 text-white font-bold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Start Selling
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4">
              {[
                { num: '10K+', label: 'Products' },
                { num: '5K+', label: 'Sellers' },
                { num: '99%', label: 'Satisfaction' },
                { num: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                  <p className="text-2xl font-black">{stat.num}</p>
                  <p className="text-xs opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Illustration/Featured */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 animate-float">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <Gift className="w-24 h-24 text-yellow-300 mx-auto mb-4" />
                    <p className="text-white/80 text-sm">Secure Transactions</p>
                    <p className="text-white font-bold text-lg">100% Protected</p>
                  </div>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300 rounded-full opacity-20 animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="#F9FAFB" />
        </svg>
      </div>
    </div>
  )
}

// ─── Category Grid ──────────────────────────────────────────────────────────
function CategoryGrid() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 -mt-8 z-10">
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Browse Categories</h2>
          <Link to="/browse" className="text-sm text-orange-500 font-medium hover:text-orange-700 flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {CATEGORIES.map(({ label, value, icon: Icon, gradient }) => (
            <Link
              key={label}
              to={`/browse${value ? `?category=${value}` : ''}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all hover:scale-105 duration-200"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <Icon size={24} className="text-white" />
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Flash Sale Section ─────────────────────────────────────────────────────
function FlashSaleSection({ products, loading, timer }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-black/10 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Flash Sale</h2>
                <p className="text-sm text-white/80">Up to 40% OFF - Limited time</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm">
                <ClockIcon className="w-5 h-5 text-white" />
                <div className="flex items-center gap-1 text-white font-mono font-bold">
                  <span className="bg-white/20 px-2 py-0.5 rounded text-lg min-w-[32px] text-center">
                    {String(timer.hours).padStart(2, '0')}
                  </span>
                  <span>:</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-lg min-w-[32px] text-center">
                    {String(timer.minutes).padStart(2, '0')}
                  </span>
                  <span>:</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-lg min-w-[32px] text-center">
                    {String(timer.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <Link
                to="/browse?sort=price_asc"
                className="px-5 py-2 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-sm flex items-center gap-1"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="p-6">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  )
}

// ─── Product Section ────────────────────────────────────────────────────────
function ProductSection({ title, subtitle, icon: Icon, to, products, loading, gradient }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className={`bg-gradient-to-r ${gradient} px-6 py-5`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                {Icon && <Icon className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{title}</h2>
                {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
              </div>
            </div>
            <Link
              to={to}
              className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all text-sm flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        <div className="p-6">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  )
}

// ─── Trust Badges ───────────────────────────────────────────────────────────
function TrustBadges() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {TRUST_BADGES.map(({ icon: Icon, title, desc, color }) => (
          <div
            key={title}
            className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className={`w-14 h-14 ${color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CTA Banner ─────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12 mb-12">
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-300 rounded-full blur-3xl" />
        </div>

        <div className="relative px-8 py-12 md:px-12 md:py-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of sellers who trust MiddleMan to handle their transactions securely.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-3.5 border-2 border-white/70 text-white font-bold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}