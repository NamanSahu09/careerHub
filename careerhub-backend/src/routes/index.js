const express = require("express");
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const adminRoutes = require("./adminRoutes");
const chatRoutes = require("./chatRoutes");
const resumeRoutes = require("./resumeRoutes");
const interviewRoutes = require("./interviewRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the CareerHub API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      jobs: "/api/jobs",
      admin: "/api/admin",
      chat: "/api/chat",
      resume: "/api/resume",
      interview: "/api/interview",
    },
  });
});

router.get("/health", (req, res) => res.status(200).json({ success: true, message: "API is healthy" }));

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/admin", adminRoutes);
router.use("/chat", chatRoutes);
router.use("/resume", resumeRoutes);
router.use("/interview", interviewRoutes);

module.exports = router;

