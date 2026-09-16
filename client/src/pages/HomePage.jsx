import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight, ArrowRight, Star, Shield, Truck,
  Headphones, Gift, TrendingUp, Award, Flame
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import ProductGrid from '../components/products/ProductGrid'
import { productsApi } from '../api/products.api'
import { categoriesApi } from '../api/categories.api'

const CATEGORY_GRADIENTS = [
  'from-blue-400 to-blue-600',
  'from-pink-400 to-pink-600',
  'from-amber-400 to-amber-600',
  'from-purple-400 to-purple-600',
  'from-emerald-400 to-emerald-600',
  'from-rose-400 to-rose-600',
  'from-indigo-400 to-indigo-600',
  'from-slate-400 to-slate-600',
]

// ─── Trust Badges ─────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Shield, title: 'Buyer Protection', desc: 'Payment held until delivery confirmed', color: 'text-emerald-600' },
  { icon: Truck, title: 'Easy Shipping', desc: 'Sellers handle shipping directly', color: 'text-blue-600' },
  { icon: Headphones, title: '24/7 Support', desc: 'We\'re here to help anytime', color: 'text-purple-600' },
  { icon: Star, title: 'Verified Reviews', desc: 'Only verified buyers can review', color: 'text-amber-600' },
]

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await productsApi.list({ limit: 20 })
      setAllProducts(data.data ?? [])
    } catch {
      setAllProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    categoriesApi.list()
      .then(({ data }) => setCategories(data.data ?? []))
      .catch(() => setCategories([]))
    fetchProducts()
  }, [fetchProducts])

  return (
    <PageWrapper className="bg-gradient-to-b from-gray-50 to-white">
      {/* ── Hero Banner ── */}
      <HeroBanner />

      {/* ── Category Grid ── */}
      <CategoryGrid categories={categories} />

      {/* ── Unified Product Section (Free, no outer container) ── */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">All Products</h2>
              <p className="text-sm text-gray-500">Discover our full collection</p>
            </div>
          </div>
          <Link
            to="/browse"
            className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm flex items-center gap-1 shadow-md"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <ProductGrid products={allProducts} loading={loadingProducts} />
      </div>

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
function CategoryGrid({ categories }) {
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
          {categories.map((category, index) => (
            <Link
              key={category._id}
              to={`/browse?category=${category._id}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all hover:scale-105 duration-200"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length]} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
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