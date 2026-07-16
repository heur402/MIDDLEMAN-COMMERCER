import { useState, useRef } from 'react'
import { Upload, X, Plus } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'
import { cn } from '../../utils/cn'

const CATEGORIES = [
  'electronics', 'clothing', 'home', 'beauty', 'sports',
  'toys', 'books', 'automotive', 'other',
]

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]

/**
 * Create / edit product form used by sellers.
 *
 * @param {object}   initialValues  Pre-fill form fields (for edit mode)
 * @param {function} onSubmit       Called with { formData, newImages } — async
 * @param {boolean}  loading
 */
export default function ProductForm({ initialValues = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initialValues.title ?? '',
    description: initialValues.description ?? '',
    price: initialValues.price ?? '',
    category: initialValues.category ?? '',
    condition: initialValues.condition ?? 'new',
    stock: initialValues.stock ?? 1,
    status: initialValues.status ?? 'published',
    tags: initialValues.tags?.join(', ') ?? '',
  })
  const [errors, setErrors] = useState({})
  const [imagePreviews, setImagePreviews] = useState(initialValues.images ?? [])
  const [newImageFiles, setNewImageFiles] = useState([])
  const fileRef = useRef()

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.price || Number(form.price) < 0) e.price = 'Valid price required'
    if (!form.category) e.category = 'Category is required'
    if (!form.condition) e.condition = 'Condition is required'
    if (!form.stock || Number(form.stock) < 0) e.stock = 'Stock must be ≥ 0'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files)
    const remaining = 5 - imagePreviews.length
    const toAdd = files.slice(0, remaining)

    toAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target.result])
      }
      reader.readAsDataURL(file)
    })
    setNewImageFiles((prev) => [...prev, ...toAdd])
  }

  function removeImage(index) {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    // If it's a new file (index >= existing images count), also remove from files array
    const existingCount = (initialValues.images ?? []).length
    if (index >= existingCount) {
      const fileIndex = index - existingCount
      setNewImageFiles((prev) => prev.filter((_, i) => i !== fileIndex))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      newImageFiles,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Product Details</h2>

        <Input
          label="Title"
          required
          placeholder="e.g. Wireless Bluetooth Headphones"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Describe your product in detail..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className={cn(
              'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900',
              'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent',
              errors.description && 'border-red-400'
            )}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="0.00"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            error={errors.price}
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            required
            placeholder="1"
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
            error={errors.stock}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={cn(
                'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900',
                'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent',
                errors.category && 'border-red-400'
              )}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => set('condition', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Tags (comma-separated)"
          placeholder="wireless, bluetooth, audio"
          value={form.tags}
          onChange={(e) => set('tags', e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="flex gap-4">
            {['published', 'draft'].map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={form.status === s}
                  onChange={() => set('status', s)}
                  className="accent-orange-500"
                />
                <span className="text-sm text-gray-700 capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Product Images</h2>
        <p className="text-xs text-gray-500 mb-4">Up to 5 images. First image is the cover.</p>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {imagePreviews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
              <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-[9px] font-bold px-1 rounded">
                  COVER
                </span>
              )}
            </div>
          ))}

          {imagePreviews.length < 5 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <Plus size={20} />
              <span className="text-xs">Add</span>
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Upload size={12} /> JPG, PNG, WEBP · Max 5 MB each
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialValues._id ? 'Save Changes' : 'Create Listing'}
        </Button>
      </div>
    </form>
  )
}
