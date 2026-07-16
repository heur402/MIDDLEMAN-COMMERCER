/**
 * Wraps an async Express route handler so thrown errors are forwarded to
 * next() without needing a try/catch in every controller.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
