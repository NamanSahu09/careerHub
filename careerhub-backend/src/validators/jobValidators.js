const { body } = require("express-validator");

const createJobValidator = [
  body("title").trim().notEmpty().withMessage("Job title is required").isLength({ max: 120 }),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("mode")
    .trim()
    .notEmpty()
    .withMessage("Work mode is required")
    .isIn(["On-site", "Hybrid", "Remote"])
    .withMessage("Mode must be On-site, Hybrid, or Remote"),
  body("experience").trim().notEmpty().withMessage("Experience range is required"),
  body("salaryMin").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Min salary must be a positive number"),
  body("salaryMax").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Max salary must be a positive number"),
  body("skills").optional().isArray().withMessage("Skills must be a list"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),
];

module.exports = { createJobValidator };
