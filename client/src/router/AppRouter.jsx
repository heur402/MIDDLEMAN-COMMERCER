import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Public pages
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProductListingPage from '../pages/ProductListingPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CartPage from '../pages/CartPage'
import NotFoundPage from '../pages/NotFoundPage'
import StorefrontPage from '../pages/storefront/StorefrontPage'
import OrderConfirmationPage from '../pages/OrderConfirmationPage'
import ContactPage from '../pages/static/ContactPage'
import FAQPage from '../pages/static/FAQPage'
import PrivacyPage from '../pages/static/PrivacyPage'

// Buyer pages (authenticated)
import CheckoutPage from '../pages/CheckoutPage'
import BuyerOrdersPage from '../pages/buyer/BuyerOrdersPage'
import BuyerOrderDetailPage from '../pages/buyer/BuyerOrderDetailPage'

// Seller pages (seller role)
import SellerDashboardPage from '../pages/seller/SellerDashboardPage'
import SellerListingsPage from '../pages/seller/SellerListingsPage'
import SellerCreateListingPage from '../pages/seller/SellerCreateListingPage'
import SellerEditListingPage from '../pages/seller/SellerEditListingPage'
import SellerOrdersPage from '../pages/seller/SellerOrdersPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────────────── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/faq" element={<HomePage />} />
      <Route path="/contact" element={<HomePage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/browse" element={<ProductListingPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/store/:sellerId" element={<StorefrontPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* ── Authenticated ──────────────────────────────────────────── */}
      <Route
        path="/checkout"
        element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
      />
      <Route
        path="/order-confirmation"
        element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>}
      />
      <Route
        path="/orders"
        element={<ProtectedRoute><BuyerOrdersPage /></ProtectedRoute>}
      />
      <Route
        path="/orders/:id"
        element={<ProtectedRoute><BuyerOrderDetailPage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><BuyerOrdersPage /></ProtectedRoute>}
      />

      {/* ── Seller ─────────────────────────────────────────────────── */}
      <Route
        path="/seller/dashboard"
        element={<ProtectedRoute role="seller"><SellerDashboardPage /></ProtectedRoute>}
      />
      <Route
        path="/seller/listings"
        element={<ProtectedRoute role="seller"><SellerListingsPage /></ProtectedRoute>}
      />
      <Route
        path="/seller/listings/new"
        element={<ProtectedRoute role="seller"><SellerCreateListingPage /></ProtectedRoute>}
      />
      <Route
        path="/seller/listings/:id/edit"
        element={<ProtectedRoute role="seller"><SellerEditListingPage /></ProtectedRoute>}
      />
      <Route
        path="/seller/orders"
        element={<ProtectedRoute role="seller"><SellerOrdersPage /></ProtectedRoute>}
      />

      {/* ── Fallback ───────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
