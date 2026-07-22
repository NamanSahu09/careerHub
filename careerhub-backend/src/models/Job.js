const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Job title is required"], trim: true, maxlength: 120 },
    company: { type: String, required: [true, "Company name is required"], trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    mode: {
      type: String,
      enum: { values: ["On-site", "Hybrid", "Remote"], message: "Mode must be On-site, Hybrid, or Remote" },
      required: true,
      default: "On-site",
    },
    experience: { type: String, required: [true, "Experience range is required"], trim: true },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    skills: {
      type: [String],
      default: [],
      set: (arr) => (Array.isArray(arr) ? arr.map((s) => s.trim()).filter(Boolean) : []),
    },
    description: { type: String, required: [true, "Job description is required"], minlength: 20 },
    status: {
      type: String,
      enum: ["Live", "Pending review", "Flagged", "Closed"],
      default: "Live",
    },
    applicantCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

jobSchema.pre("validate", function checkSalaryRange(next) {
  if (this.salaryMin != null && this.salaryMax != null && this.salaryMin > this.salaryMax) {
    return next(new Error("salaryMin cannot be greater than salaryMax"));
  }
  next();
});

jobSchema.index({ title: "text", company: "text", skills: "text" });

module.exports = mongoose.model("Job", jobSchema);
