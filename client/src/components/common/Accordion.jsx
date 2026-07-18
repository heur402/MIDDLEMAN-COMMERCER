import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Single collapsible accordion item.
 */
export function AccordionItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className={cn(
          'text-sm font-semibold transition-colors',
          open ? 'text-orange-600' : 'text-gray-900 group-hover:text-orange-500'
        )}>
          {question}
        </span>
        {open
          ? <ChevronUp size={18} className="text-orange-500 shrink-0" />
          : <ChevronDown size={18} className="text-gray-400 shrink-0 group-hover:text-orange-400" />
        }
      </button>

      {open && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

/**
 * Accordion group with optional category title.
 */
export default function Accordion({ title, items = [] }) {
  return (
    <section className="mb-8">
      {title && (
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
          {title}
        </h2>
      )}
      <div className="bg-white rounded-2xl shadow-sm px-6 divide-y divide-gray-100">
        {items.map((item, i) => (
          <AccordionItem key={i} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  )
}
