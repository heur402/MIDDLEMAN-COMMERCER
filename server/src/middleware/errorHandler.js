import { ApiError } from '../utils/ApiError.js'

/**
 * Global Express error handler.
 * Must be registered LAST in app.js with 4 parameters.
 *
 * Consistent response shape:
 *   { success: false, message: string, errors?: array }
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // ── Mongoose duplicate-key error ─────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] ?? 'field'
    return res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists.`,
    })
  }

  // ── Mongoose validation error ────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    return res.status(422).json({ success: false, message: 'Validation failed', errors })
  }

  // ── JWT errors ───────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }

  // ── Known operational errors (ApiError) ─────────────────────────────────
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors?.length ? { errors: err.errors } : {}),
    })
  }

  // ── Unknown / unexpected errors ──────────────────────────────────────────
  console.error('Unexpected error:', err)
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  })
}
