import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageSpinner } from '../components/common/Spinner'

/**
 * Route guard for authenticated-only pages (seller / admin dashboards,
 * order history, profile, messages).
 *
 * Buyers can browse, add to cart, and checkout without any account.
 * Only sellers and admins need to be logged in.
 *
 * @param {string} role  Optional: 'seller' | 'admin' — restricts to that role.
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, hasRole } = useAuth()

  // Still loading auth state from token
  if (loading) return <PageSpinner />

  // Not logged in — redirect to login (no redirect param; LoginForm handles role-based destination)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role
  if (role && !hasRole(role)) {
    return <Navigate to="/" replace />
  }

  return children
}
