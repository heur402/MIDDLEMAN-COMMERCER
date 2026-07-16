/**
 * Custom error class for known API errors.
 * Thrown inside controllers and caught by the global error handler.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode  HTTP status code
   * @param {string} message     Human-readable error message
   * @param {Array}  errors      Optional field-level validation errors
   */
  constructor(statusCode, message, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.isOperational = true   // flag to distinguish from unexpected crashes
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(msg, errors)   { return new ApiError(400, msg, errors) }
  static unauthorized(msg)         { return new ApiError(401, msg ?? 'Unauthorised') }
  static forbidden(msg)            { return new ApiError(403, msg ?? 'Forbidden') }
  static notFound(msg)             { return new ApiError(404, msg ?? 'Not found') }
  static conflict(msg)             { return new ApiError(409, msg) }
  static unprocessable(msg, errors){ return new ApiError(422, msg, errors) }
  static internal(msg)             { return new ApiError(500, msg ?? 'Internal server error') }
}
