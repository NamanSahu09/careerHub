const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  registerCandidateValidator,
  registerEmployerValidator,
  loginValidator,
} = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");
const { protect } = require("../middleware/auth");
const {
  registerCandidate,
  registerEmployer,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const router = express.Router();

/**
 * Auth endpoints are rate-limited harder than the rest of the API since
 * they're the most common brute-force / credential-stuffing target.
 */
const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: "RATE_LIMITED",
    message: "Too many attempts from this device. Please try again later.",
  },
});

router.post("/register/candidate", authLimiter, registerCandidateValidator, validateRequest, registerCandidate);
router.post("/register/employer", authLimiter, registerEmployerValidator, validateRequest, registerEmployer);
router.post("/login", authLimiter, loginValidator, validateRequest, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
