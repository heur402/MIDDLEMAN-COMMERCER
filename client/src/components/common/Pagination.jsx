import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Page-based pagination control.
 *
 * @param {number} page       Current page (1-indexed)
 * @param {number} totalPages Total number of pages
 * @param {function} onChange Called with the new page number
 */
export default function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null

  // Build visible page numbers with ellipsis
  function getPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = []
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <PageBtn
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </PageBtn>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <PageBtn
            key={p}
            onClick={() => onChange(p)}
            active={p === page}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </PageBtn>
        )
      )}

      <PageBtn
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </PageBtn>
    </nav>
  )
}

function PageBtn({ children, onClick, disabled, active, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        active
          ? 'bg-orange-500 text-white'
          : 'text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed'
      )}
      {...props}
    >
      {children}
    </button>
  )
}
