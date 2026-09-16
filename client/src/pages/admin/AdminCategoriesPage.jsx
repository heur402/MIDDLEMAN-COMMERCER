import { useState, useEffect } from 'react'
import {
  Tag, Plus, Trash2, Edit2,
} from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { PageSpinner } from '../../components/common/Spinner'
import { categoriesApi } from '../../api/categories.api'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import toast from 'react-hot-toast'
import DocxImportButton from '../../components/common/DocxImportButton'
import { sellerApi } from '../../api/seller.api'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [isEditing, setIsEditing] = useState(null) // category ID or 'new'
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formIcon, setFormIcon] = useState('')
  const [formActive, setFormActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  async function handleBulkImport(file) {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await sellerApi.bulkImportCategories(formData)
      setImportResult(data.data)
      toast.success(data.message)
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Import failed')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const { data } = await categoriesApi.listAll()
      setCategories(data.data ?? [])
    } catch (err) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  function startCreate() {
    setIsEditing('new')
    setFormName('')
    setFormDesc('')
    setFormIcon('🏷️')
    setFormActive(true)
  }

  function startEdit(cat) {
    setIsEditing(cat._id)
    setFormName(cat.name)
    setFormDesc(cat.description ?? '')
    setFormIcon(cat.icon ?? '🏷️')
    setFormActive(cat.isActive)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!formName.trim()) {
      toast.error('Name is required')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        name: formName.trim(),
        description: formDesc.trim(),
        icon: formIcon.trim() || null,
        isActive: formActive,
      }

      if (isEditing === 'new') {
        await categoriesApi.create(payload)
        toast.success('Category created')
      } else {
        await categoriesApi.update(isEditing, payload)
        toast.success('Category updated')
      }
      setIsEditing(null)
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to save category')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this category? Products referencing it may be affected.')) {
      return
    }
    try {
      await categoriesApi.remove(id)
      toast.success('Category deleted')
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete category')
    }
  }

  return (
    <AdminLayout>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manage Categories</h1>
                <p className="text-sm text-gray-500">Add, edit, or delete product categories</p>
              </div>
              {!isEditing && (
                <div className="flex items-center gap-2">
                  <DocxImportButton
                    onDownloadTemplate={sellerApi.downloadCategoriesTemplate}
                    templateFilename="categories_template.docx"
                    onUpload={handleBulkImport}
                    label="Bulk Import"
                  />
                  <Button onClick={startCreate}>
                    <Plus size={16} /> Add Category
                  </Button>
                </div>
              )}
            </div>

            {importResult && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <div className="flex justify-between gap-3">
                  <span>{importResult.created} categor{importResult.created === 1 ? 'y' : 'ies'} created.</span>
                  <button onClick={() => setImportResult(null)} aria-label="Dismiss import result">×</button>
                </div>
                {importResult.errors?.length > 0 && (
                  <ul className="mt-2 text-xs text-red-600 space-y-1">
                    {importResult.errors.map((error) => <li key={error}>{error}</li>)}
                  </ul>
                )}
              </div>
            )}

            {isEditing && (
              <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 space-y-4">
                <h2 className="text-base font-bold text-gray-900">
                  {isEditing === 'new' ? 'New Category' : 'Edit Category'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Category Name"
                    required
                    placeholder="e.g. Health & Beauty"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                  <Input
                    label="Icon Emoji / Class"
                    placeholder="e.g. 💄 or lucide icon name"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                  />
                  <div className="flex flex-col gap-1.5 justify-center">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={formActive}
                        onChange={(e) => setFormActive(e.target.checked)}
                        className="accent-orange-500 rounded"
                      />
                      <span className="text-sm text-gray-700">Active (Visible to sellers & buyers)</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of products in this category"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting}>
                    Save Category
                  </Button>
                </div>
              </form>
            )}

            {loading ? <PageSpinner /> : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                        <th className="px-6 py-4">Icon</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Slug</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                            No categories found. Click 'Add Category' to create one.
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat) => (
                          <tr key={cat._id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 text-lg">{cat.icon ?? '🏷️'}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900">{cat.name}</td>
                            <td className="px-6 py-4 font-mono text-xs">{cat.slug}</td>
                            <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{cat.description || '—'}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                cat.isActive
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-gray-50 text-gray-500 border border-gray-200'
                              }`}>
                                {cat.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => startEdit(cat)}
                                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-orange-500 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(cat._id)}
                                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
    </AdminLayout>
  )
}
