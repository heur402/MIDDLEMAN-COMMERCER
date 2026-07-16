import { ApiError } from '../utils/ApiError.js'

/**
 * Role-based access control middleware.
 * Must be used AFTER verifyToken (req.user must be set).
 *
 * Usage:
 *   router.get('/admin/users', verifyToken, requireRoles('admin'), handler)
 *   router.post('/listings', verifyToken, requireRoles('seller'), handler)
 *
 * @param {...string} roles  One or more allowed roles
 */
export function requireRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized())
    }
    const hasRole = roles.some((role) => req.user.roles.includes(role))
    if (!hasRole) {
      return next(
        ApiError.forbidden(`Requires one of the following roles: ${roles.join(', ')}`)
      )
    }
    next()
  }
}
