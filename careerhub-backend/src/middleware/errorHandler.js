const ApiError = require("../utils/ApiError");
const ERROR_CODES = require("../utils/errorCodes");

/**
 * Translates raw Mongoose/JS errors into an ApiError shape so every error
 * response — expected or not — comes back as:
 *   { success: false, code, message, errors: [{ field, message }] }
 */
function normalizeError(err) {
  if (err instanceof ApiError) return err;

  // Duplicate key (unique index violation) — e.g. email or phone already registered.
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || { field: 1 })[0];
    const code = field === "phone" ? ERROR_CODES.PHONE_ALREADY_EXISTS : ERROR_CODES.EMAIL_ALREADY_EXISTS;
    return new ApiError(409, code, `That ${field} is already registered`, [
      { field, message: `This ${field} is already in use` },
    ]);
  }

  // Mongoose schema validation error (belt-and-suspenders vs. express-validator).
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return new ApiError(400, ERROR_CODES.VALIDATION_ERROR, "One or more fields are invalid", errors);
  }

  // Malformed ObjectId in a route param, e.g. GET /api/jobs/not-an-id
  if (err.name === "CastError") {
    return new ApiError(400, ERROR_CODES.VALIDATION_ERROR, `Invalid value for ${err.path}`, [
      { field: err.path, message: "Invalid identifier" },
    ]);
  }

  if (err.name === "JsonWebTokenError") {
    return new ApiError(401, ERROR_CODES.TOKEN_INVALID, "Invalid authentication token");
  }
  if (err.name === "TokenExpiredError") {
    return new ApiError(401, ERROR_CODES.TOKEN_EXPIRED, "Session expired, please log in again");
  }

  // Unrecognized error — never leak internals to the client.
  return new ApiError(500, ERROR_CODES.INTERNAL_ERROR, "Something went wrong on our end");
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const apiError = normalizeError(err);

  if (apiError.statusCode >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);
  }

  res.status(apiError.statusCode).json({
    success: false,
    code: apiError.code,
    message: apiError.message,
    errors: apiError.errors?.length ? apiError.errors : undefined,
  });
}

module.exports = errorHandler;
