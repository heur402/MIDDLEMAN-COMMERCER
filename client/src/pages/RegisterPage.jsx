import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import RegisterForm from '../components/auth/RegisterForm'
import { Store, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-3xl font-black">
              <span className="text-orange-500">Middle</span>
              <span className="text-gray-900">Man</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Create a Seller Account</p>
        </div>

        {/* Seller perks */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5 space-y-2">
          <div className="flex items-center gap-2">
            <Store size={16} className="text-orange-500 shrink-0" />
            <p className="text-xs font-semibold text-orange-800">Why sell on MiddleMan?</p>
          </div>
          {[
            'List products for free — no upfront fees',
            'Buyers pay through our protected checkout',
            'Manage orders and track earnings in one dashboard',
          ].map((perk) => (
            <div key={perk} className="flex items-start gap-2">
              <CheckCircle size={12} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700">{perk}</p>
            </div>
          ))}
        </div>

        {/* Info banner — buyers don't need an account */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-2">
          <p className="text-xs text-blue-700">
            <strong>Just here to buy?</strong> No account needed.{' '}
            <Link to="/browse" className="underline font-medium">Browse products →</Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Create your seller account</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
