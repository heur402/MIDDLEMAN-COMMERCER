import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'
import { ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <span className="text-3xl font-black">
            <span className="text-orange-500">Middle</span>
            <span className="text-gray-900">Man</span>
          </span>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Trust signal */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-6">
          <ShieldCheck size={16} className="text-green-600 shrink-0" />
          <p className="text-xs text-green-700">
            Your transactions are protected by MiddleMan's buyer guarantee.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Welcome back</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
