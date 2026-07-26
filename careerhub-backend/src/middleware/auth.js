const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ERROR_CODES = require("../utils/errorCodes");
const asyncHandler = require("../utils/asyncHandler");

/** Reads the JWT from the httpOnly cookie, or an Authorization: Bearer header as a fallback (useful for non-browser clients / tests). */
function extractToken(req) {
  if (req.cookies?.token) return req.cookies.token;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

const protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new ApiError(401, ERROR_CODES.NOT_AUTHENTICATED, "You must be logged in to do that");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, ERROR_CODES.TOKEN_EXPIRED, "Session expired, please log in again");
    }
    throw new ApiError(401, ERROR_CODES.TOKEN_INVALID, "Invalid authentication token");
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(401, ERROR_CODES.USER_NOT_FOUND, "Account no longer exists or is disabled");
  }

  req.user = user;
  next();
});

/** Usage: authorize("employer"), authorize("admin", "employer"), etc. */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, ERROR_CODES.NOT_AUTHENTICATED, "You must be logged in to do that"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          ERROR_CODES.FORBIDDEN_ROLE,
          `This action requires one of these roles: ${allowedRoles.join(", ")}`
        )
      );
    }
    next();
  };
}

module.exports = { protect, authorize };
