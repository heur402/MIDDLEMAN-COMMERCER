import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminRegisterPage() {
  const { isAuthenticated, isAdmin, register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', adminSecret: '' })
  const [showPw, setShowPw] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())        e.name        = 'Name is required'
    if (!form.email)              e.email       = 'Email is required'
    if (form.password.length < 8) e.password    = 'Password must be at least 8 characters'
    if (!form.adminSecret.trim()) e.adminSecret = 'Admin secret key is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register({ ...form, asAdmin: true })
      toast.success('Admin account created!')
      navigate('/admin')
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Registration failed'
      toast.error(msg)
      if (msg.toLowerCase().includes('secret')) {
        setErrors({ adminSecret: 'Invalid admin secret key' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <ShieldCheck size={28} className="text-orange-400" />
            <span className="text-3xl font-black">
              <span className="text-orange-400">Middle</span>
              <span className="text-white">Man</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm">Create Admin Account</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <h1 className="text-xl font-bold text-white mb-2">Admin Registration</h1>
          <p className="text-xs text-gray-500 mb-6">
            You need the admin secret key to create an admin account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <Field label="Full Name" error={errors.name}>
              <FieldInput icon={User} placeholder="Your full name" value={form.name}
                onChange={(e) => set('name', e.target.value)} hasError={!!errors.name} />
            </Field>

            {/* Email */}
            <Field label="Email address" error={errors.email}>
              <FieldInput icon={Mail} type="email" placeholder="admin@example.com" value={form.email}
                onChange={(e) => set('email', e.target.value)} hasError={!!errors.email} />
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password}>
              <FieldInput icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                value={form.password} onChange={(e) => set('password', e.target.value)} hasError={!!errors.password}
                trailing={
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            </Field>

            {/* Admin Secret */}
            <Field label="Admin Secret Key" error={errors.adminSecret}>
              <FieldInput icon={KeyRound} type={showSecret ? 'text' : 'password'} placeholder="Enter the admin secret"
                value={form.adminSecret} onChange={(e) => set('adminSecret', e.target.value)} hasError={!!errors.adminSecret}
                trailing={
                  <button type="button" onClick={() => setShowSecret((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors mt-2"
            >
              {loading ? 'Creating account…' : 'Create Admin Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/admin/login" className="text-orange-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Small helpers to keep the form DRY ───────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function FieldInput({ icon: Icon, hasError, trailing, ...props }) {
  return (
    <div className="relative">
      <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        {...props}
        className={`w-full pl-9 ${trailing ? 'pr-10' : 'pr-3'} py-2.5 rounded-lg bg-gray-700 border text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          hasError ? 'border-red-500' : 'border-gray-600'
        }`}
      />
      {trailing}
    </div>
  )
}
