const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  startInterview,
  evaluateAnswer,
  completeInterview,
  getHistory,
} = require("../controllers/interviewController");

const router = express.Router();

// All interview routes require a logged-in candidate
router.use(protect, authorize("candidate"));

router.post("/start", startInterview);
router.post("/evaluate", evaluateAnswer);
router.post("/complete", completeInterview);
router.get("/history", getHistory);

module.exports = router;
