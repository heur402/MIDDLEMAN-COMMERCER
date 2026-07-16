import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-orange-400 font-black text-xl">
                Middle<span className="text-white">Man</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              The trusted marketplace where buyers and sellers trade with confidence.
              We own the transaction so you don't have to worry.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink href="#" label="Facebook" svg={<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>} />
              <SocialLink href="#" label="Twitter/X" svg={<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>} />
              <SocialLink href="#" label="Instagram" svg={<svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>} />
              <SocialLink href="#" label="YouTube" svg={<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>} />
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Shop</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/browse">All Products</FooterLink>
              <FooterLink to="/browse?condition=new">New Arrivals</FooterLink>
              <FooterLink to="/browse?sort=price_asc">Best Prices</FooterLink>
              <FooterLink to="/browse?category=electronics">Electronics</FooterLink>
              <FooterLink to="/browse?category=clothing">Clothing</FooterLink>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Sell</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/register">Start Selling</FooterLink>
              <FooterLink to="/seller/dashboard">Seller Dashboard</FooterLink>
              <FooterLink to="/seller/listings">My Listings</FooterLink>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Help</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MiddleMan Commerce. All rights reserved.</p>
          <p>Built with trust, powered by transparency.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="hover:text-orange-400 transition-colors">
        {children}
      </Link>
    </li>
  )
}

function SocialLink({ href, svg, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white transition-colors"
    >
      {svg}
    </a>
  )
}
