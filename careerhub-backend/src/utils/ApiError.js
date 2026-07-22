/**
 * Throw this anywhere in a controller/middleware; errorHandler.js turns it
 * into a consistent JSON response. `errors` is an optional array of
 * per-field validation problems: [{ field, message }].
 */
class ApiError extends Error {
  constructor(statusCode, code, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
