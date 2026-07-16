import { ZodError } from 'zod'
import { ApiError } from '../utils/ApiError.js'

/**
 * Zod request validation middleware factory.
 * Validates req.body against a Zod schema and replaces req.body
 * with the parsed (stripped + coerced) output on success.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register)
 *
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source  Which part of req to validate (default: body)
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source])
      req[source] = parsed
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        return next(ApiError.badRequest('Validation failed', errors))
      }
      next(err)
    }
  }
}
