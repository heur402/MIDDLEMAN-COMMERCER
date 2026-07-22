import { cn } from '../../utils/cn'

/**
 * Shared layout for legal / policy pages.
 * Renders a sticky table-of-contents sidebar on desktop
 * and inline sections on mobile.
 *
 * @param {string}  title
 * @param {string}  lastUpdated
 * @param {Array}   sections   [{ id, title, content }]
 */
export default function PolicyLayout({ title, lastUpdated, sections = [] }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Page heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">Last updated: {lastUpdated}</p>
      </div>

      <div className="flex gap-10">
        {/* Sticky ToC — desktop only */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Contents
            </p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs text-gray-600 hover:text-orange-500 py-1 transition-colors leading-snug"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-base font-bold text-gray-900 mb-3">{s.title}</h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white rounded-2xl shadow-sm p-6">
                {s.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
