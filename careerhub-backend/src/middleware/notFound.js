const ApiError = require("../utils/ApiError");
const ERROR_CODES = require("../utils/errorCodes");

function notFound(req, res, next) {
  next(new ApiError(404, ERROR_CODES.ROUTE_NOT_FOUND, `No route: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
