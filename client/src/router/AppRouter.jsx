import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../context/AuthContext'

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
import BuyerDisputesPage      from '../pages/buyer/BuyerDisputesPage'
import ProfilePage           from '../pages/ProfilePage'

import NotificationsPage from '../pages/NotificationsPage'

// Seller pages
import SellerDashboardPage     from '../pages/seller/SellerDashboardPage'
import SellerListingsPage      from '../pages/seller/SellerListingsPage'
import SellerCreateListingPage from '../pages/seller/SellerCreateListingPage'
import SellerEditListingPage   from '../pages/seller/SellerEditListingPage'
import SellerOrdersPage        from '../pages/seller/SellerOrdersPage'
import SellerOrderDetailPage   from '../pages/seller/SellerOrderDetailPage'

// Admin pages
import AdminLoginPage       from '../pages/AdminLoginPage'
import AdminRegisterPage    from '../pages/AdminRegisterPage'
import AdminDashboardPage   from '../pages/admin/AdminDashboardPage'
import AdminUsersPage       from '../pages/admin/AdminUsersPage'
import AdminListingsPage    from '../pages/admin/AdminListingsPage'
import AdminCategoriesPage  from '../pages/admin/AdminCategoriesPage'
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage'
import AdminDisputesPage      from '../pages/admin/AdminDisputesPage'

export default function AppRouter() {
  const { isSeller, isAdmin } = useAuth()

  function FallbackRoute() {
    if (isAdmin)  return <Navigate to="/admin" replace />
    if (isSeller) return <Navigate to="/seller/dashboard" replace />
    return <NotFoundPage />
  }

  return (
    <Routes>

      {/* ── Public ──────────────────────────────────────────────── */}
      <Route path="/"                   element={<HomePage />} />
      <Route path="/browse"             element={<ProductListingPage />} />
      <Route path="/products/:id"       element={<ProductDetailPage />} />
      <Route path="/store/:sellerId"    element={<StorefrontPage />} />
      <Route path="/cart"               element={<CartPage />} />
      <Route path="/checkout"           element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      <Route path="/track-order"        element={<GuestOrderTrackingPage />} />

      {/* ── Seller auth ─────────────────────────────────────────── */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Admin auth ──────────────────────────────────────────── */}
      <Route path="/admin/login"    element={<AdminLoginPage />} />
      <Route path="/admin/register" element={<AdminRegisterPage />} />

      {/* ── Static ──────────────────────────────────────────────── */}
      <Route path="/faq"     element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms"   element={<TermsPage />} />

      {/* ── Authenticated buyer ─────────────────────────────────── */}
      <Route path="/dashboard" element={<ProtectedRoute><BuyerDashboardPage /></ProtectedRoute>} />
      <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/orders"    element={<ProtectedRoute><BuyerOrdersPage /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><BuyerOrderDetailPage /></ProtectedRoute>} />
      <Route path="/disputes" element={<ProtectedRoute><BuyerDisputesPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

      {/* ── Seller ──────────────────────────────────────────────── */}
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

      {/* ── Admin ───────────────────────────────────────────────── */}
      <Route path="/admin"
        element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>}
      />
      <Route path="/admin/users"
        element={<ProtectedRoute role="admin"><AdminUsersPage /></ProtectedRoute>}
      />
      <Route path="/admin/listings"
        element={<ProtectedRoute role="admin"><AdminListingsPage /></ProtectedRoute>}
      />
      <Route path="/admin/categories"
        element={<ProtectedRoute role="admin"><AdminCategoriesPage /></ProtectedRoute>}
      />
      <Route path="/admin/notifications"
        element={<ProtectedRoute role="admin"><AdminNotificationsPage /></ProtectedRoute>}
      />
      <Route path="/admin/disputes"
        element={<ProtectedRoute role="admin"><AdminDisputesPage /></ProtectedRoute>}
      />

      {/* ── Fallback ────────────────────────────────────────────── */}
      <Route path="*" element={<FallbackRoute />} />

    </Routes>
  )
}
