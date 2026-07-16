import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage() {
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
          <p className="text-gray-500 text-sm mt-1">Create your free account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Join MiddleMan</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
