import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches { userId, roles } to req.user on success.
 */
export const verifyToken = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No token provided')
  }

  const token = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)

  // Check the user still exists and is not banned
  const user = await User.findById(decoded.userId).select('_id roles isBanned').lean()
  if (!user) throw ApiError.unauthorized('User no longer exists')
  if (user.isBanned) throw ApiError.forbidden('Your account has been suspended')

  req.user = { userId: user._id.toString(), roles: user.roles }
  next()
})
