import { User } from '../models/User.js'
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  refreshCookieOptions,
} from '../services/auth.service.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// ── POST /api/auth/register ───────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) throw ApiError.conflict('An account with that email already exists')

  const passwordHash = await hashPassword(password)
  const user = await User.create({ name, email, passwordHash, roles: ['buyer'] })

  const accessToken  = generateAccessToken({ userId: user._id, roles: user.roles })
  const refreshToken = generateRefreshToken({ userId: user._id })

  res.cookie('refreshToken', refreshToken, refreshCookieOptions())

  return res.status(201).json({
    success: true,
    accessToken,
    data: user.toPublicJSON(),
  })
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) throw ApiError.unauthorized('Invalid email or password')

  const valid = await user.comparePassword(password)
  if (!valid) throw ApiError.unauthorized('Invalid email or password')

  if (user.isBanned) throw ApiError.forbidden('Your account has been suspended')

  const accessToken  = generateAccessToken({ userId: user._id, roles: user.roles })
  const refreshToken = generateRefreshToken({ userId: user._id })

  res.cookie('refreshToken', refreshToken, refreshCookieOptions())

  return res.json({
    success: true,
    accessToken,
    data: user.toPublicJSON(),
  })
})

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken
  if (!token) throw ApiError.unauthorized('No refresh token provided')

  const decoded = verifyRefreshToken(token)

  const user = await User.findById(decoded.userId).select('_id roles isBanned')
  if (!user) throw ApiError.unauthorized('User not found')
  if (user.isBanned) throw ApiError.forbidden('Your account has been suspended')

  const accessToken = generateAccessToken({ userId: user._id, roles: user.roles })

  return res.json({ success: true, accessToken })
})

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' })
  return res.json({ success: true, message: 'Logged out' })
})
