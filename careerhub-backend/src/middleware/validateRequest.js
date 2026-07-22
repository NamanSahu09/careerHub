const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");
const ERROR_CODES = require("../utils/errorCodes");

/**
 * Run after a validator chain. Collects every failed rule (not just the
 * first) so the frontend can show all field errors at once instead of one
 * at a time per resubmission.
 */
function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array({ onlyFirstError: true }).map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  return next(
    new ApiError(400, ERROR_CODES.VALIDATION_ERROR, "One or more fields are invalid", errors)
  );
}

module.exports = validateRequest;
