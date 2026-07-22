import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') // explicit redirect from ProtectedRoute

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email) e.email = 'Email is required'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password })
      toast.success('Account created! Welcome 🎉')

      if (redirect) {
        navigate(redirect)
        return
      }

      // Registration page is seller-focused — auto-enable seller role
      // (the server creates buyer by default; becomeSeller adds the seller role)
      try {
        const { authApi } = await import('../../api/auth.api')
        await authApi.becomeSeller()
      } catch {
        // ignore if it fails — user can enable from profile
      }

      navigate('/seller/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Registration failed. Try again.'
      if (msg.toLowerCase().includes('email')) {
        setErrors({ email: msg })
      }
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full name"
        type="text"
        required
        autoComplete="name"
        placeholder="Jane Smith"
        leadingIcon={User}
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors.name}
      />

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
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

      <Input
        label="Confirm password"
        type={showPassword ? 'text' : 'password'}
        required
        autoComplete="new-password"
        placeholder="Repeat your password"
        leadingIcon={Lock}
        value={form.confirmPassword}
        onChange={(e) => set('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
      />

      <Button type="submit" fullWidth size="lg" loading={loading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-orange-500 font-medium hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-gray-400">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}
