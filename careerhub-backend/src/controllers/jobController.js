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

<<<<<<< HEAD
module.exports = { getJobs, getJobById, createJob, getMyJobs, updateJob, deleteJob };
=======
// GET /api/jobs/linkedin
const getLinkedInScrapedJobs = asyncHandler(async (req, res) => {
  const { query, location } = req.query;
  const https = require("https");

  const apiToken = process.env.APIFY_API_TOKEN || "";
  const apifyUrl = `https://api.apify.com/v2/actor-runs/1na2Rb36SGZdR4cKW/dataset/items?token=${apiToken}`;

  https.get(apifyUrl, (response) => {
    let rawData = "";
    response.on("data", (chunk) => { rawData += chunk; });
    response.on("end", () => {
      try {
        const items = JSON.parse(rawData);
        if (!Array.isArray(items)) {
          return res.status(200).json({ success: true, jobs: [] });
        }

        // Normalize and filter based on search parameters
        let filteredJobs = items.map((item) => {
          // Parse salary range if possible
          let salaryMin = 0;
          let salaryMax = 0;
          if (item.description && item.description.includes("$")) {
            const matches = item.description.match(/\$(\d+)/g);
            if (matches && matches.length >= 2) {
              salaryMin = parseInt(matches[0].replace("$", "")) || 0;
              salaryMax = parseInt(matches[1].replace("$", "")) || 0;
            }
          }

          return {
            _id: `li_${item.id}`,
            title: item.title,
            company: item.companyName,
            location: item.location || "Remote",
            mode: item.description && item.description.toLowerCase().includes("remote") ? "Remote" : "On-site",
            experience: item.experienceLevel || "Entry level",
            salaryMin,
            salaryMax,
            skills: item.sector ? item.sector.split(", ").slice(0, 4) : ["LinkedIn Job", "CareerHub Match"],
            description: item.description || "",
            companyLogo: item.companyLogo || null,
            applyUrl: item.applyUrl || item.jobUrl,
            postedTime: item.postedTime || "Recently",
            isExternal: true
          };
        });

        // Apply text filters
        if (query) {
          const q = query.toLowerCase();
          filteredJobs = filteredJobs.filter(j => 
            j.title.toLowerCase().includes(q) || 
            j.company.toLowerCase().includes(q) ||
            j.description.toLowerCase().includes(q)
          );
        }

        if (location) {
          const loc = location.toLowerCase();
          filteredJobs = filteredJobs.filter(j => j.location.toLowerCase().includes(loc));
        }

        res.status(200).json({ success: true, jobs: filteredJobs });
      } catch (err) {
        console.error("Apify parsing error:", err);
        res.status(200).json({ success: true, jobs: [] });
      }
    });
  }).on("error", (err) => {
    console.error("Apify API call error:", err);
    res.status(200).json({ success: true, jobs: [] });
  });
});

module.exports = { getJobs, getJobById, createJob, getMyJobs, updateJob, deleteJob, getLinkedInScrapedJobs };

>>>>>>> 8d914f4cfb394a2e011c29396af02894f0b1a056
