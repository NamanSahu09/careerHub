const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");
const ERROR_CODES = require("../utils/errorCodes");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/jobs?query=&location=&mode=&experience=&page=&limit=
const getJobs = asyncHandler(async (req, res) => {
  const { query, location, mode, experience, page = 1, limit = 12 } = req.query;

  const filter = { status: "Live" };
  if (query) filter.$text = { $search: query };
  if (location) filter.location = new RegExp(location, "i");
  if (mode) filter.mode = mode;
  if (experience) filter.experience = experience;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 12));

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    jobs,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, ERROR_CODES.JOB_NOT_FOUND, "Job not found");
  }
  res.status(200).json({ success: true, job });
});

// POST /api/jobs  (employer only)
const createJob = asyncHandler(async (req, res) => {
  const { title, location, mode, experience, salaryMin, salaryMax, skills, description } = req.body;

  const job = await Job.create({
    title,
    company: req.user.companyName || req.user.name,
    postedBy: req.user._id,
    location,
    mode,
    experience,
    salaryMin,
    salaryMax,
    skills,
    description,
  });

  res.status(201).json({ success: true, message: "Job posted", job });
});

// GET /api/jobs/mine  (employer only — their own postings, any status)
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, jobs });
});

async function loadOwnedJob(req) {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, ERROR_CODES.JOB_NOT_FOUND, "Job not found");
  }
  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, ERROR_CODES.FORBIDDEN_OWNER, "You can only manage jobs you posted");
  }
  return job;
}

// PATCH /api/jobs/:id  (owner employer or admin)
const updateJob = asyncHandler(async (req, res) => {
  const job = await loadOwnedJob(req);
  const editable = ["title", "location", "mode", "experience", "salaryMin", "salaryMax", "skills", "description", "status"];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) job[field] = req.body[field];
  });
  await job.save();
  res.status(200).json({ success: true, message: "Job updated", job });
});

// DELETE /api/jobs/:id  (owner employer or admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await loadOwnedJob(req);
  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted" });
});

module.exports = { getJobs, getJobById, createJob, getMyJobs, updateJob, deleteJob };
