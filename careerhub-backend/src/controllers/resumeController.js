const Resume = require("../models/Resume");
const ApiError = require("../utils/ApiError");
const ERROR_CODES = require("../utils/errorCodes");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/resume
const getMyResume = asyncHandler(async (req, res) => {
  let resume = await Resume.findOne({ user: req.user._id });
  if (!resume) {
    // Return a skeleton structure if no resume exists yet
    // pre-filled with user's name/email/phone from registration
    return res.status(200).json({
      success: true,
      resume: {
        personalDetails: {
          fullName: req.user.name || "",
          email: req.user.email || "",
          phone: req.user.phone || "",
          title: "",
          summary: "",
        },
        education: [],
        experience: [],
        skills: [],
        projects: [],
      },
    });
  }
  res.status(200).json({ success: true, resume });
});

// POST /api/resume
const saveResume = asyncHandler(async (req, res) => {
  const { personalDetails, education, experience, skills, projects } = req.body;

  if (!personalDetails || !personalDetails.fullName || !personalDetails.email || !personalDetails.phone) {
    throw new ApiError(400, ERROR_CODES.VALIDATION_ERROR, "Full name, email, and phone number are required.");
  }

  let resume = await Resume.findOne({ user: req.user._id });
  if (resume) {
    resume.personalDetails = personalDetails;
    resume.education = education || [];
    resume.experience = experience || [];
    resume.skills = skills || [];
    resume.projects = projects || [];
    await resume.save();
  } else {
    resume = await Resume.create({
      user: req.user._id,
      personalDetails,
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      projects: projects || [],
    });
  }

  res.status(200).json({ success: true, message: "Resume saved successfully", resume });
});

// GET /api/resume/search
const searchResumes = asyncHandler(async (req, res) => {
  const { query } = req.query;

  let filter = {};
  if (query) {
    filter = { $text: { $search: query } };
  }

  const resumes = await Resume.find(filter).populate("user", "name email phone");

  res.status(200).json({ success: true, resumes });
});

module.exports = { getMyResume, saveResume, searchResumes };
