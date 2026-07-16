import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'

const SALT_ROUNDS = 10

/**
 * Hash a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>}
 */
export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

/**
 * Generate a short-lived JWT access token.
 * @param {{ userId: string, roles: string[] }} payload
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  })
}

/**
 * Generate a long-lived JWT refresh token.
 * @param {{ userId: string }} payload
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  })
}

/**
 * Verify a refresh token and return its decoded payload.
 * Throws if invalid or expired.
 * @param {string} token
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET)
}

/**
 * Cookie options for the refresh token HTTP-only cookie.
 */
export function refreshCookieOptions() {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: SEVEN_DAYS_MS,
  }
}
