const User = require("../models/User");
const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");
const ERROR_CODES = require("../utils/errorCodes");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [liveJobs, candidates, employers, totalApplicants] = await Promise.all([
    Job.countDocuments({ status: "Live" }),
    User.countDocuments({ role: "candidate" }),
    User.countDocuments({ role: "employer" }),
    Job.aggregate([{ $group: { _id: null, sum: { $sum: "$applicantCount" } } }]),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      liveJobs,
      candidates,
      employers,
      applications: totalApplicants[0]?.sum || 0,
    },
  });
});

// GET /api/admin/jobs?status=&query=
const getAllJobs = asyncHandler(async (req, res) => {
  const { status, query } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (query) filter.$text = { $search: query };

  const jobs = await Job.find(filter).sort({ createdAt: -1 }).populate("postedBy", "name email companyName");
  res.status(200).json({ success: true, jobs });
});

// PATCH /api/admin/jobs/:id/status  { status }
const updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["Live", "Pending review", "Flagged", "Closed"];
  if (!allowed.includes(status)) {
    throw new ApiError(400, ERROR_CODES.VALIDATION_ERROR, `status must be one of: ${allowed.join(", ")}`, [
      { field: "status", message: "Invalid status value" },
    ]);
  }

  const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!job) throw new ApiError(404, ERROR_CODES.JOB_NOT_FOUND, "Job not found");

  res.status(200).json({ success: true, message: "Job status updated", job });
});

// GET /api/admin/candidates
const getAllCandidates = asyncHandler(async (req, res) => {
  const candidates = await User.find({ role: "candidate" }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, candidates: candidates.map((c) => c.toSafeJSON()) });
});

// GET /api/admin/employers
const getAllEmployers = asyncHandler(async (req, res) => {
  const employers = await User.find({ role: "employer" }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, employers: employers.map((e) => e.toSafeJSON()) });
});

// PATCH /api/admin/users/:id/disable
const setUserActive = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: Boolean(isActive) }, { new: true });
  if (!user) throw new ApiError(404, ERROR_CODES.USER_NOT_FOUND, "User not found");
  res.status(200).json({ success: true, message: "User updated", user: user.toSafeJSON() });
});

module.exports = { getStats, getAllJobs, updateJobStatus, getAllCandidates, getAllEmployers, setUserActive };
