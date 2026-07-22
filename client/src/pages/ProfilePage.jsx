import { useState } from 'react'
import { Camera, Plus, Trash2, MapPin } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth.api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' })
  const [saving, setSaving] = useState(false)

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await authApi.updateMe(form)
      updateUser(data.data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  async function becomeSeller() {
    try {
      const { data } = await authApi.becomeSeller()
      updateUser(data.data)
      toast.success("You're now a seller!")
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed')
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>

        {/* Avatar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-2xl overflow-hidden">
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : user?.name?.[0]?.toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-orange-500 text-white rounded-full shadow hover:bg-orange-600 transition-colors" aria-label="Change avatar">
                <Camera size={12} />
              </button>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {user?.roles?.map((role) => (
                  <span key={role} className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full capitalize">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Personal info form */}
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
          <Input label="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          <Input label="Email address" value={user?.email ?? ''} disabled helperText="Email cannot be changed" />
          <Input label="Phone number" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 234 567 8900" />
          <Button type="submit" loading={saving}>Save Changes</Button>
        </form>

        {/* Addresses */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Saved Addresses</h2>
            <Button size="sm" variant="secondary"><Plus size={14} /> Add Address</Button>
          </div>
          {(!user?.addresses || user.addresses.length === 0) ? (
            <div className="text-center py-6 text-gray-400">
              <MapPin size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No saved addresses yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.addresses.map((addr, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-lg border border-gray-200">
                  <div className="flex gap-2">
                    <MapPin size={15} className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{addr.label || 'Address'}</p>
                      <p className="text-xs text-gray-600">{[addr.street, addr.city, addr.country].filter(Boolean).join(', ')}</p>
                      {addr.isDefault && <span className="text-[10px] bg-orange-100 text-orange-700 font-semibold px-1.5 py-0.5 rounded-full">Default</span>}
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Become seller CTA */}
        {!user?.roles?.includes('seller') && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Start selling on MiddleMan</p>
              <p className="text-xs text-gray-600 mt-0.5">List products and reach thousands of buyers.</p>
            </div>
            <Button size="sm" onClick={becomeSeller}>Become a Seller</Button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
