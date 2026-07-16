import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageSpinner } from '../components/common/Spinner'

/**
 * Route guard that checks authentication and optional role requirement.
 *
 * @param {string} role  Required role: 'buyer' | 'seller' | 'admin'
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, hasRole } = useAuth()
  const location = useLocation()

  if (loading) return <PageSpinner />

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
