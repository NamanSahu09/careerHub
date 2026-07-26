const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getStats,
  getAllJobs,
  updateJobStatus,
  getAllCandidates,
  getAllEmployers,
  setUserActive,
} = require("../controllers/adminController");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/jobs", getAllJobs);
router.patch("/jobs/:id/status", updateJobStatus);
router.get("/candidates", getAllCandidates);
router.get("/employers", getAllEmployers);
router.patch("/users/:id/active", setUserActive);

module.exports = router;
