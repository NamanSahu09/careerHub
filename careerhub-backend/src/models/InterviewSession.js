const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    score: { type: Number, min: 0, max: 10, default: 0 },
    feedback: { type: String, default: "" },
    modelAnswer: { type: String, default: "" },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["Fresher", "Mid", "Senior"],
        message: "Difficulty must be Fresher, Mid, or Senior",
      },
      required: true,
      default: "Fresher",
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C", "D", "—"],
      default: "—",
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
