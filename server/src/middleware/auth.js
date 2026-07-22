import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * REQUIRED auth — rejects request if no valid token present.
 * Attaches { userId, roles } to req.user.
 */
export const verifyToken = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No token provided')
  }

  const token = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)

  const user = await User.findById(decoded.userId).select('_id roles isBanned').lean()
  if (!user) throw ApiError.unauthorized('User no longer exists')
  if (user.isBanned) throw ApiError.forbidden('Your account has been suspended')

  req.user = { userId: user._id.toString(), roles: user.roles }
  next()
})

/**
 * OPTIONAL auth — attaches req.user if a valid token is present,
 * but does NOT reject if the token is missing.
 * Used for routes that serve both guests and logged-in users (e.g. place order).
 */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    req.user = null
    return next()
  }

  try {
    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)
    const user    = await User.findById(decoded.userId).select('_id roles isBanned').lean()

    if (user && !user.isBanned) {
      req.user = { userId: user._id.toString(), roles: user.roles }
    } else {
      req.user = null
    }
  } catch {
    req.user = null
  }

  next()
})
