import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') // explicit redirect from URL param

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const data = await login(form)
      toast.success('Welcome back!')

      // If an explicit redirect was requested (e.g. from ProtectedRoute), use it
      if (redirect) {
        navigate(redirect)
        return
      }

      // Smart role-based redirect — data.data is the user object
      const roles = data?.data?.roles ?? []
      if (roles.includes('admin')) {
        navigate('/admin')
      } else if (roles.includes('seller')) {
        navigate('/seller/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Invalid email or password'
      toast.error(msg)
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email address"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        leadingIcon={Mail}
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
        error={errors.email}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          leadingIcon={Lock}
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <Button type="submit" fullWidth size="lg" loading={loading}>
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          to={`/register${redirect ? `?redirect=${redirect}` : ''}`}
          className="text-orange-500 font-medium hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  )
}
