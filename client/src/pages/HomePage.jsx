import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Smartphone, Shirt, Home as HomeIcon, Sparkles, Dumbbell,
  Baby, BookOpen, Car, Grid2x2, Zap, ChevronRight, Clock,
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import ProductGrid from '../components/products/ProductGrid'
import { productsApi } from '../api/products.api'
import { countdown } from '../utils/formatDate'

// ── Category grid data ────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Electronics', value: 'electronics', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { label: 'Clothing', value: 'clothing', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { label: 'Home', value: 'home', icon: HomeIcon, color: 'bg-yellow-100 text-yellow-600' },
  { label: 'Beauty', value: 'beauty', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
  { label: 'Sports', value: 'sports', icon: Dumbbell, color: 'bg-green-100 text-green-600' },
  { label: 'Toys', value: 'toys', icon: Baby, color: 'bg-red-100 text-red-600' },
  { label: 'Books', value: 'books', icon: BookOpen, color: 'bg-indigo-100 text-indigo-600' },
  { label: 'Automotive', value: 'automotive', icon: Car, color: 'bg-gray-100 text-gray-600' },
  { label: 'All', value: '', icon: Grid2x2, color: 'bg-orange-100 text-orange-600' },
]

// Flash sale ends in 8 hours from page load
const FLASH_END = new Date(Date.now() + 8 * 60 * 60 * 1000)

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
    <PageWrapper>
      {/* ── Hero banner ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">
              🔒 Trusted Middleman Marketplace
            </p>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              Buy & Sell with<br />
              <span className="text-yellow-300">Full Confidence</span>
            </h1>
            <p className="text-sm md:text-base opacity-90 mb-6 max-w-md">
              We own the transaction lifecycle — your payment is protected until you
              confirm delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/browse"
                className="px-6 py-2.5 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors shadow"
              >
                Shop Now
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 border border-white/70 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              {[
                { num: '10K+', label: 'Products' },
                { num: '5K+', label: 'Sellers' },
                { num: '99%', label: 'Satisfaction' },
                { num: '24/7', label: 'Support' },
              ].map((s) => (
                <div key={s.label} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-2xl font-black">{s.num}</p>
                  <p className="text-xs opacity-80">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Category grid ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {CATEGORIES.map(({ label, value, icon: Icon, color }) => (
            <Link
              key={label}
              to={`/browse${value ? `?category=${value}` : ''}`}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Flash Sale ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <div className="flex items-center gap-2">
              <Zap size={18} className="fill-yellow-300 text-yellow-300" />
              <span className="font-bold text-sm">Flash Sale</span>
              <span className="text-xs opacity-90 hidden sm:block">Up to 40% OFF</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Clock size={13} />
              <span>Ends in</span>
              <CountdownUnit value={timer.hours} />
              <span>:</span>
              <CountdownUnit value={timer.minutes} />
              <span>:</span>
              <CountdownUnit value={timer.seconds} />
            </div>
            <Link
              to="/browse?sort=price_asc"
              className="text-xs font-medium underline opacity-90 hover:opacity-100 flex items-center gap-0.5"
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>
          {/* Products */}
          <div className="p-4">
            <ProductGrid products={flashProducts} loading={loadingFlash} />
          </div>
        </div>
      </div>

      {/* ── New Arrivals ─────────────────────────────────────────────── */}
      <Section
        title="New Arrivals"
        subtitle="Just listed"
        to="/browse?sort=newest"
        products={newProducts}
        loading={loadingNew}
      />

      {/* ── Top Rated ────────────────────────────────────────────────── */}
      <Section
        title="Top Rated"
        subtitle="Trusted by buyers"
        to="/browse?sort=rating"
        products={featuredProducts}
        loading={loadingFeatured}
      />

      {/* ── Trust badges ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🔒', title: 'Buyer Protection', desc: 'Payment held until delivery confirmed' },
            { icon: '🚚', title: 'Easy Shipping', desc: 'Sellers handle shipping directly' },
            { icon: '💬', title: 'Direct Chat', desc: 'Message sellers before buying' },
            { icon: '⭐', title: 'Verified Reviews', desc: 'Only buyers can leave reviews' },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">{b.icon}</div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{b.title}</p>
              <p className="text-xs text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

function Section({ title, subtitle, to, products, loading }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <Link
            to={to}
            className="text-sm text-orange-500 font-medium hover:text-orange-700 flex items-center gap-0.5"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="p-4">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  )
}

function CountdownUnit({ value }) {
  const str = String(value).padStart(2, '0')
  return (
    <span className="bg-black/30 rounded px-1 py-0.5 font-mono font-bold text-sm">{str}</span>
  )
}
