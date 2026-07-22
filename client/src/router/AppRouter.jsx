import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Public pages
import HomePage                from '../pages/HomePage'
import LoginPage               from '../pages/LoginPage'
import RegisterPage            from '../pages/RegisterPage'
import ProductListingPage      from '../pages/ProductListingPage'
import ProductDetailPage       from '../pages/ProductDetailPage'
import CartPage                from '../pages/CartPage'
import CheckoutPage            from '../pages/CheckoutPage'
import OrderConfirmationPage   from '../pages/OrderConfirmationPage'
import GuestOrderTrackingPage  from '../pages/GuestOrderTrackingPage'
import NotFoundPage            from '../pages/NotFoundPage'
import StorefrontPage          from '../pages/storefront/StorefrontPage'

// Static info pages
import FAQPage     from '../pages/static/FAQPage'
import ContactPage from '../pages/static/ContactPage'
import PrivacyPage from '../pages/static/PrivacyPage'
import TermsPage   from '../pages/static/TermsPage'

// Authenticated buyer pages
import BuyerDashboardPage    from '../pages/buyer/BuyerDashboardPage'
import BuyerOrdersPage       from '../pages/buyer/BuyerOrdersPage'
import BuyerOrderDetailPage  from '../pages/buyer/BuyerOrderDetailPage'
import ProfilePage           from '../pages/ProfilePage'

// Chat
import MessagesPage from '../pages/chat/MessagesPage'

// Seller pages
import SellerDashboardPage     from '../pages/seller/SellerDashboardPage'
import SellerListingsPage      from '../pages/seller/SellerListingsPage'
import SellerCreateListingPage from '../pages/seller/SellerCreateListingPage'
import SellerEditListingPage   from '../pages/seller/SellerEditListingPage'
import SellerOrdersPage        from '../pages/seller/SellerOrdersPage'
import SellerOrderDetailPage   from '../pages/seller/SellerOrderDetailPage'

// Admin pages
import AdminDashboardPage  from '../pages/admin/AdminDashboardPage'

export default function AppRouter() {
  return (
    <Routes>

      {/* ── Public — no login ever required for buyers ──────────── */}
      <Route path="/"                  element={<HomePage />} />
      <Route path="/browse"            element={<ProductListingPage />} />
      <Route path="/products/:id"      element={<ProductDetailPage />} />
      <Route path="/store/:sellerId"   element={<StorefrontPage />} />
      <Route path="/cart"              element={<CartPage />} />
      <Route path="/checkout"          element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      <Route path="/track-order"       element={<GuestOrderTrackingPage />} />

      {/* ── Auth pages (sellers only) ───────────────────────────── */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Static info pages ──────────────────────────────────── */}
      <Route path="/faq"     element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms"   element={<TermsPage />} />

      {/* ── Authenticated user routes ───────────────────────────── */}
      <Route path="/dashboard"
        element={<ProtectedRoute><BuyerDashboardPage /></ProtectedRoute>}
      />
      <Route path="/profile"
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
      />
      <Route path="/orders"
        element={<ProtectedRoute><BuyerOrdersPage /></ProtectedRoute>}
      />
      <Route path="/orders/:id"
        element={<ProtectedRoute><BuyerOrderDetailPage /></ProtectedRoute>}
      />
      <Route path="/messages"
        element={<ProtectedRoute><MessagesPage /></ProtectedRoute>}
      />

      {/* ── Seller routes ───────────────────────────────────────── */}
      <Route path="/seller/dashboard"
        element={<ProtectedRoute role="seller"><SellerDashboardPage /></ProtectedRoute>}
      />
      <Route path="/seller/listings"
        element={<ProtectedRoute role="seller"><SellerListingsPage /></ProtectedRoute>}
      />
      <Route path="/seller/listings/new"
        element={<ProtectedRoute role="seller"><SellerCreateListingPage /></ProtectedRoute>}
      />
      <Route path="/seller/listings/:id/edit"
        element={<ProtectedRoute role="seller"><SellerEditListingPage /></ProtectedRoute>}
      />
      <Route path="/seller/orders"
        element={<ProtectedRoute role="seller"><SellerOrdersPage /></ProtectedRoute>}
      />
      <Route path="/seller/orders/:id"
        element={<ProtectedRoute role="seller"><SellerOrderDetailPage /></ProtectedRoute>}
      />

      {/* ── Admin routes ────────────────────────────────────────── */}
      <Route path="/admin"
        element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>}
      />

      {/* ── Fallback ────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}
