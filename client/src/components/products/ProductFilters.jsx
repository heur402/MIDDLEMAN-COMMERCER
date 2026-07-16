import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import Button from '../common/Button'
import { cn } from '../../utils/cn'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing & Fashion' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'beauty', label: 'Beauty & Health' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'toys', label: 'Toys & Baby' },
  { value: 'books', label: 'Books & Media' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'other', label: 'Other' },
]

const CONDITIONS = [
  { value: '', label: 'Any Condition' },
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

/**
 * Filter sidebar / drawer for product browse.
 *
 * @param {object}   filters    Current filter state: { category, condition, minPrice, maxPrice, sort }
 * @param {function} onChange   Called with updated filter object
 */
export default function ProductFilters({ filters = {}, onChange, className }) {
  const [priceMin, setPriceMin] = useState(filters.minPrice ?? '')
  const [priceMax, setPriceMax] = useState(filters.maxPrice ?? '')
  const [openSections, setOpenSections] = useState({
    category: true,
    condition: true,
    price: true,
    sort: true,
  })

  function toggle(section) {
    setOpenSections((s) => ({ ...s, [section]: !s[section] }))
  }

  function handleChange(field, value) {
    onChange({ ...filters, [field]: value })
  }

  function applyPriceFilter() {
    onChange({
      ...filters,
      minPrice: priceMin === '' ? undefined : Number(priceMin),
      maxPrice: priceMax === '' ? undefined : Number(priceMax),
    })
  }

  function clearAll() {
    setPriceMin('')
    setPriceMax('')
    onChange({ sort: 'newest' })
  }

  const hasActiveFilters =
    filters.category || filters.condition || filters.minPrice || filters.maxPrice

  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-4 space-y-1', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
          <Filter size={15} /> Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-orange-500 hover:text-orange-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <Section title="Sort By" open={openSections.sort} onToggle={() => toggle('sort')}>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={(filters.sort ?? 'newest') === opt.value}
                onChange={() => handleChange('sort', opt.value)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-orange-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Category" open={openSections.category} onToggle={() => toggle('category')}>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={(filters.category ?? '') === cat.value}
                onChange={() => handleChange('category', cat.value || undefined)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-orange-600">{cat.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Condition */}
      <Section title="Condition" open={openSections.condition} onToggle={() => toggle('condition')}>
        <div className="space-y-1">
          {CONDITIONS.map((c) => (
            <label key={c.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                value={c.value}
                checked={(filters.condition ?? '') === c.value}
                onChange={() => handleChange('condition', c.value || undefined)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-orange-600">{c.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price range */}
      <Section title="Price Range" open={openSections.price} onToggle={() => toggle('price')}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <Button size="sm" variant="secondary" fullWidth className="mt-2" onClick={applyPriceFilter}>
          Apply
        </Button>
      </Section>
    </div>
  )
}

function Section({ title, open, onToggle, children }) {
  return (
    <div className="border-t border-gray-100 pt-3">
      <button
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 mb-2"
        onClick={onToggle}
        aria-expanded={open}
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}
