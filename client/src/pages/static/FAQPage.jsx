import { useState } from 'react'
import { Search } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Accordion from '../../components/common/Accordion'
import { FAQ_CATEGORIES } from '../../data/faqData'

export default function FAQPage() {
  const [query, setQuery] = useState('')

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">Frequently Asked Questions</h1>
          <p className="text-orange-100 text-base max-w-xl mx-auto">
            Everything you need to know about buying, selling, and staying safe on MiddleMan.
          </p>
          {/* Search */}
          <div className="mt-6 flex items-center max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
            <Search size={16} className="text-gray-400 ml-4 shrink-0" />
            <input
              type="text"
              placeholder="Search questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-3 text-sm text-gray-900 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {FAQ_CATEGORIES.map((cat) => {
          const filtered = {
            ...cat,
            items: cat.items.filter(
              (item) =>
                query.trim() === '' ||
                item.question.toLowerCase().includes(query.toLowerCase()) ||
                item.answer.toLowerCase().includes(query.toLowerCase())
            ),
          }
          if (filtered.items.length === 0) return null
          return <Accordion key={cat.title} title={cat.title} items={filtered.items} />
        })}

        {/* No results */}
        {FAQ_CATEGORIES.every((cat) =>
          cat.items.every(
            (item) =>
              query.trim() !== '' &&
              !item.question.toLowerCase().includes(query.toLowerCase()) &&
              !item.answer.toLowerCase().includes(query.toLowerCase())
          )
        ) && (
          <p className="text-center text-gray-400 py-16 text-sm">
            No results for &quot;{query}&quot;. Try a different search term.
          </p>
        )}
      </div>
    </PageWrapper>
  )
}
