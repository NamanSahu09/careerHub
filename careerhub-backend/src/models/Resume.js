const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personalDetails: {
      fullName: { type: String, required: [true, "Full name is required"], trim: true },
      email: { type: String, required: [true, "Email is required"], lowercase: true, trim: true },
      phone: { type: String, required: [true, "Phone number is required"], trim: true },
      title: { type: String, trim: true },
      summary: { type: String, trim: true },
    },
    education: [
      {
        school: { type: String, trim: true },
        degree: { type: String, trim: true },
        startYear: { type: String },
        endYear: { type: String },
      },
    ],
    experience: [
      {
        company: { type: String, trim: true },
        position: { type: String, trim: true },
        startYear: { type: String },
        endYear: { type: String },
        description: { type: String, trim: true },
      },
    ],
    skills: {
      type: [String],
      default: [],
    },
    projects: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        technologies: { type: [String], default: [] },
      },
    ],
  },
  { timestamps: true }
);

// Enable text search across name, title, bio, and skills
resumeSchema.index({
  "personalDetails.fullName": "text",
  "personalDetails.title": "text",
  "personalDetails.summary": "text",
  skills: "text",
});

module.exports = mongoose.model("Resume", resumeSchema);
