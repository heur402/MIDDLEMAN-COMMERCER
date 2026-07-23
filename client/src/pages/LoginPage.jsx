import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'
import { Store, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
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
          <p className="text-gray-500 text-sm mt-1">Seller &amp; Admin Portal</p>
        </div>

        {/* Info banner — buyers don't need an account */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-2">
          <Store size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-800">Shopping without an account?</p>
            <p className="text-xs text-blue-700 mt-0.5">
              You don't need to log in to browse or buy.{' '}
              <Link to="/browse" className="underline font-medium">Start shopping →</Link>
            </p>
          </div>
        </div>

       

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Sign in to your account</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
