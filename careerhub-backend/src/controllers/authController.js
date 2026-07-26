const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ERROR_CODES = require("../utils/errorCodes");
const asyncHandler = require("../utils/asyncHandler");
const { signToken, cookieOptions } = require("../utils/generateToken");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

function issueSession(res, user) {
  const token = signToken({ sub: user._id.toString(), role: user.role });
  res.cookie("token", token, cookieOptions());
  return token;
}

/** Shared by candidate/employer registration — only the role + extra fields differ. */
async function createUser({ role, name, email, phone, password, companyName }) {
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new ApiError(409, ERROR_CODES.EMAIL_ALREADY_EXISTS, "An account with this email already exists", [
      { field: "email", message: "Email is already registered" },
    ]);
  }

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(409, ERROR_CODES.PHONE_ALREADY_EXISTS, "An account with this phone number already exists", [
      { field: "phone", message: "Phone number is already registered" },
    ]);
  }

  return User.create({ role, name, email, phone, password, companyName });
}

// POST /api/auth/register/candidate
const registerCandidate = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const user = await createUser({ role: "candidate", name, email, phone, password });
  issueSession(res, user);
  res.status(201).json({ success: true, message: "Account created", user: user.toSafeJSON() });
});

// POST /api/auth/register/employer
const registerEmployer = asyncHandler(async (req, res) => {
  const { name, email, phone, password, companyName } = req.body;
  const user = await createUser({ role: "employer", name, email, phone, password, companyName });
  issueSession(res, user);
  res.status(201).json({ success: true, message: "Company account created", user: user.toSafeJSON() });
});

// POST /api/auth/login  { email, password, role? }
// `role` is optional — if provided (candidate/employer/admin), login is
// rejected when the account's actual role doesn't match, so a candidate
// can't accidentally (or deliberately) authenticate through the employer form.
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    throw new ApiError(401, ERROR_CODES.INVALID_CREDENTIALS, "Incorrect email or password");
  }

  if (user.isLocked()) {
    const minsLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new ApiError(
      401,
      ERROR_CODES.ACCOUNT_DISABLED,
      `Too many failed attempts. Try again in ${minsLeft} minute(s).`
    );
  }

  if (!user.isActive) {
    throw new ApiError(401, ERROR_CODES.ACCOUNT_DISABLED, "This account has been disabled");
  }

  if (role && user.role !== role) {
    throw new ApiError(401, ERROR_CODES.INVALID_CREDENTIALS, "Incorrect email or password");
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    throw new ApiError(401, ERROR_CODES.INVALID_CREDENTIALS, "Incorrect email or password");
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();

  issueSession(res, user);
  res.status(200).json({ success: true, message: "Logged in", user: user.toSafeJSON() });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", { ...cookieOptions(), maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged out" });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeJSON() });
});

module.exports = { registerCandidate, registerEmployer, login, logout, getMe };
