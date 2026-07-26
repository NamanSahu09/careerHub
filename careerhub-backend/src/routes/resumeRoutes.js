const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getMyResume, saveResume, searchResumes } = require("../controllers/resumeController");

const router = express.Router();

// Candidate endpoints to manage their own resume
router.get("/", protect, authorize("candidate"), getMyResume);
router.post("/", protect, authorize("candidate"), saveResume);

// Employer/Admin endpoints to search candidates
router.get("/search", protect, authorize("employer", "admin"), searchResumes);

module.exports = router;
