import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Image gallery for product detail page.
 * Features: thumbnail strip, arrow nav, zoom/lightbox on click.
 */
export default function ProductImageGallery({ images = [] }) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const safeImages = images.length ? images : [null]

  function prev() {
    setCurrent((c) => (c - 1 + safeImages.length) % safeImages.length)
  }
  function next() {
    setCurrent((c) => (c + 1) % safeImages.length)
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
          {safeImages[current] ? (
            <img
              src={safeImages[current]}
              alt={`Product image ${current + 1}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Lightbox trigger */}
          {safeImages[current] && (
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
              aria-label="Zoom image"
            >
              <ZoomIn size={16} className="text-gray-700" />
            </button>
          )}

          {/* Arrow navigation */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {safeImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i === current ? 'bg-orange-500' : 'bg-white/70'
                  )}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {safeImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {safeImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                  i === current ? 'border-orange-500' : 'border-gray-200 hover:border-gray-400'
                )}
              >
                {img ? (
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && safeImages[current] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            ✕
          </button>
          <img
            src={safeImages[current]}
            alt="Zoomed view"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
