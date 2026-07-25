const express = require("express");
const { createJobValidator } = require("../validators/jobValidators");
const validateRequest = require("../middleware/validateRequest");
const { protect, authorize } = require("../middleware/auth");
const {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getLinkedInScrapedJobs,
} = require("../controllers/jobController");

const router = express.Router();

// Public list and LinkedIn proxy
router.get("/", getJobs);
router.get("/linkedin", getLinkedInScrapedJobs);

// Employer-only — must come before "/:id" so "mine" isn't parsed as an id
router.get("/mine", protect, authorize("employer"), getMyJobs);
router.post("/", protect, authorize("employer"), createJobValidator, validateRequest, createJob);
router.patch("/:id", protect, authorize("employer", "admin"), updateJob);
router.delete("/:id", protect, authorize("employer", "admin"), deleteJob);

// Public detail — keep last among GETs so it doesn't shadow "/mine" or "/linkedin"
router.get("/:id", getJobById);

module.exports = router;

