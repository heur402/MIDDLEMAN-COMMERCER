import { useState, useEffect } from 'react'
import { ShieldAlert, Edit2, Trash2, ShieldCheck, Search, Bell } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { PageSpinner } from '../../components/common/Spinner'
import { adminApi } from '../../api/admin.api'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const [editingUser, setEditingUser] = useState(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formRoles, setFormRoles] = useState([])
  const [formVerified, setFormVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [notifyUser, setNotifyUser] = useState(null)
  const [notifyTitle, setNotifyTitle] = useState('')
  const [notifyMessage, setNotifyMessage] = useState('')
  const [notifying, setNotifying] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => { fetchUsers() }, [page, q])

  async function fetchUsers() {
    setLoading(true)
    try {
      const { data } = await adminApi.getUsers({ page, limit: 10, q })
      setUsers(data.data ?? [])
      setPagination(data.pagination ?? { page: 1, totalPages: 1 })
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  async function handleNotifySend(e) {
    e.preventDefault()
    if (!notifyTitle.trim()) { toast.error('Title is required'); return }
    setNotifying(true)
    try {
      await adminApi.notifyUser(notifyUser._id, { title: notifyTitle.trim(), message: notifyMessage.trim() })
      toast.success('Notification sent')
      setNotifyUser(null)
    } catch { toast.error('Failed to send notification') }
    finally { setNotifying(false) }
  }

  function handleSearchSubmit(e) { e.preventDefault(); setQ(searchVal); setPage(1) }

  function handleEditStart(u) {
    setEditingUser(u); setFormName(u.name); setFormEmail(u.email)
    setFormPhone(u.phone ?? ''); setFormRoles(u.roles ?? []); setFormVerified(u.isVerified ?? false)
  }

  async function handleEditSave(e) {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim()) { toast.error('Name and Email are required'); return }
    setSubmitting(true)
    try {
      await adminApi.updateUser(editingUser._id, {
        name: formName.trim(), email: formEmail.trim(),
        phone: formPhone.trim() || null, roles: formRoles, isVerified: formVerified,
      })
      toast.success('User updated'); setEditingUser(null); fetchUsers()
    } catch (err) { toast.error(err.response?.data?.message ?? 'Failed to update user') }
    finally { setSubmitting(false) }
  }

  async function handleToggleBan(u) {
    if (!window.confirm(`Are you sure you want to ${u.isBanned ? 'unban' : 'ban'} ${u.name}?`)) return
    try {
      await adminApi.banUser(u._id, { banned: !u.isBanned, reason: 'Admin panel action' })
      toast.success(`User ${u.isBanned ? 'unbanned' : 'banned'}`); fetchUsers()
    } catch { toast.error('Failed to update ban status') }
  }

  async function handleDeleteUser(u) {
    if (!window.confirm(`Permanently delete ${u.name}? This cannot be undone.`)) return
    try {
      await adminApi.deleteUser(u._id); toast.success('User deleted'); fetchUsers()
    } catch (err) { toast.error(err.response?.data?.message ?? 'Failed to delete user') }
  }

  function toggleRole(role, checked) {
    setFormRoles((prev) => checked ? [...prev, role] : prev.filter((r) => r !== role))
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-sm text-gray-500">Edit profiles, toggle ban status, or delete accounts</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text" placeholder="Search by name or email..."
            value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <Button type="submit" size="sm"><Search size={15} /> Search</Button>
        </form>
      </div>

      {editingUser && (
        <form onSubmit={handleEditSave} className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Edit: {editingUser.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Full Name" required value={formName} onChange={(e) => setFormName(e.target.value)} />
            <Input label="Email" type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            <Input label="Phone" placeholder="+1 555 123 4567" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Roles</label>
              <div className="flex gap-4">
                {['buyer', 'seller', 'admin'].map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer capitalize">
                    <input type="checkbox" checked={formRoles.includes(role)}
                      onChange={(e) => toggleRole(role, e.target.checked)} className="accent-orange-500" />
                    <span className="text-sm text-gray-700">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input type="checkbox" checked={formVerified} onChange={(e) => setFormVerified(e.target.checked)} className="accent-orange-500" />
                <span className="text-sm text-gray-700 font-medium">Verified Seller</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Update</Button>
          </div>
        </form>
      )}

      {loading ? <PageSpinner /> : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Roles</th>
                    <th className="px-6 py-4">Verified</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {users.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No users found.</td></tr>
                  ) : users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {u.name[0]?.toUpperCase()}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span key={r} className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 rounded capitalize">{r}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {u.isVerified
                          ? <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium"><ShieldCheck size={14} /> Verified</span>
                          : <span className="text-xs text-gray-400">Not Verified</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          u.isBanned ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                        }`}>{u.isBanned ? 'Suspended' : 'Active'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditStart(u)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-orange-500" title="Edit"><Edit2 size={15} /></button>
                          <button onClick={() => { setNotifyUser(u); setNotifyTitle(''); setNotifyMessage('') }} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-500" title="Notify"><Bell size={15} /></button>
                          <button onClick={() => handleToggleBan(u)} className={`p-1.5 hover:bg-gray-100 rounded ${u.isBanned ? 'text-green-600' : 'text-amber-600'}`} title={u.isBanned ? 'Unban' : 'Suspend'}><ShieldAlert size={15} /></button>
                          <button onClick={() => handleDeleteUser(u)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-500" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* Notify Modal */}
      {notifyUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleNotifySend} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-base font-bold text-gray-900">Notify: {notifyUser.name}</h2>
            <Input label="Title" required placeholder="e.g. Your account is under review"
              value={notifyTitle} onChange={(e) => setNotifyTitle(e.target.value)} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Message <span className="text-gray-400 text-xs">(optional)</span></label>
              <textarea rows={3} placeholder="Additional details..." value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="secondary" onClick={() => setNotifyUser(null)}>Cancel</Button>
              <Button type="submit" loading={notifying}>Send Notification</Button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  )
}
