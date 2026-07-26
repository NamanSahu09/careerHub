const { body } = require("express-validator");

/**
 * Password: 8-15 characters, at least one letter and one number.
 * Kept in one place so register/change-password validators stay in sync.
 */
const passwordRule = body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required")
  .bail()
  .isLength({ min: 8, max: 15 })
  .withMessage("Password must be between 8 and 15 characters")
  .bail()
  .matches(/[A-Za-z]/)
  .withMessage("Password must contain at least one letter")
  .matches(/\d/)
  .withMessage("Password must contain at least one number");

/** Phone: digits only, exactly 10 characters — no +91, spaces, or dashes. */
const phoneRule = body("phone")
  .trim()
  .notEmpty()
  .withMessage("Phone number is required")
  .bail()
  .isLength({ min: 10, max: 10 })
  .withMessage("Phone number must be exactly 10 digits")
  .bail()
  .isNumeric({ no_symbols: true })
  .withMessage("Phone number must contain digits only");

const nameRule = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .bail()
  .isLength({ min: 2, max: 80 })
  .withMessage("Name must be between 2 and 80 characters")
  .matches(/^[A-Za-z\s.'-]+$/)
  .withMessage("Name can only contain letters and spaces");

const emailRule = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .bail()
  .isEmail()
  .withMessage("Enter a valid email address")
  .normalizeEmail();

const confirmPasswordRule = body("confirmPassword")
  .notEmpty()
  .withMessage("Confirm password is required")
  .bail()
  .custom((value, { req }) => value === req.body.password)
  .withMessage("Passwords do not match");

const registerCandidateValidator = [nameRule, emailRule, phoneRule, passwordRule, confirmPasswordRule];

const registerEmployerValidator = [
  nameRule,
  emailRule,
  phoneRule,
  passwordRule,
  confirmPasswordRule,
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 120 })
    .withMessage("Company name must be between 2 and 120 characters"),
];

const loginValidator = [
  emailRule,
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerCandidateValidator,
  registerEmployerValidator,
  loginValidator,
  passwordRule,
  phoneRule,
  nameRule,
  emailRule,
};
