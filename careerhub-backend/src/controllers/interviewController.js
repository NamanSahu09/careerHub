const { GoogleGenerativeAI } = require("@google/generative-ai");
const InterviewSession = require("../models/InterviewSession");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    throw new ApiError(503, "SERVICE_UNAVAILABLE", "AI Interview is not configured. Set GEMINI_API_KEY in .env.");
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModel(genAI) {
  return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
}

/**
 * Calls Gemini and expects a JSON response.
 * Strips markdown fences if the model wraps its reply in ```json … ```.
 */
async function askJSON(model, prompt) {
  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip ```json ... ``` wrapper if present
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  }

  return JSON.parse(text);
}

// ---------------------------------------------------------------------------
// POST /api/interview/start
// Generates 5 role-specific interview questions.
// Body: { role: string, difficulty: string }
// ---------------------------------------------------------------------------
const startInterview = asyncHandler(async (req, res) => {
  const { role, difficulty = "Fresher" } = req.body;

  if (!role || typeof role !== "string" || role.trim().length === 0) {
    throw new ApiError(400, "BAD_REQUEST", "Job role is required.");
  }

  const genAI = getGenAI();
  const model = getModel(genAI);

  const prompt = `You are a professional technical interviewer conducting a mock interview for the role of "${role.trim()}" at ${difficulty} level in India.

Generate exactly 5 interview questions. Mix technical, behavioral, and situational questions appropriate for this role and difficulty level.

Rules:
- Questions should be realistic and commonly asked in Indian tech interviews.
- For Fresher: focus on fundamentals, projects, and learning ability.
- For Mid: focus on experience-based, system design lite, and problem-solving.
- For Senior: focus on leadership, architecture decisions, and complex trade-offs.

Return ONLY a JSON array of 5 strings, nothing else. Example:
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

  const questions = await askJSON(model, prompt);

  if (!Array.isArray(questions) || questions.length < 5) {
    throw new ApiError(502, "AI_ERROR", "Failed to generate interview questions. Try again.");
  }

  // Persist a new in-progress session
  const session = await InterviewSession.create({
    user: req.user._id,
    role: role.trim(),
    difficulty,
    questions: questions.slice(0, 5).map((q) => ({ question: q })),
    status: "in-progress",
  });

  res.status(201).json({
    success: true,
    sessionId: session._id,
    role: session.role,
    difficulty: session.difficulty,
    questions: session.questions.map((q) => q.question),
  });
});

// ---------------------------------------------------------------------------
// POST /api/interview/evaluate
// Evaluates a single answer.
// Body: { sessionId, questionIndex, answer }
// ---------------------------------------------------------------------------
const evaluateAnswer = asyncHandler(async (req, res) => {
  const { sessionId, questionIndex, answer } = req.body;

  if (!sessionId || questionIndex == null || !answer) {
    throw new ApiError(400, "BAD_REQUEST", "sessionId, questionIndex, and answer are required.");
  }

  const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) throw new ApiError(404, "NOT_FOUND", "Interview session not found.");
  if (session.status === "completed") throw new ApiError(400, "BAD_REQUEST", "This interview is already completed.");

  const qObj = session.questions[questionIndex];
  if (!qObj) throw new ApiError(400, "BAD_REQUEST", "Invalid question index.");

  const genAI = getGenAI();
  const model = getModel(genAI);

  const prompt = `You are evaluating a candidate's answer in a mock interview for the role of "${session.role}" (${session.difficulty} level).

Question: "${qObj.question}"
Candidate's Answer: "${answer}"

Evaluate the answer and return a JSON object with exactly these keys:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentences explaining what was good and what could be improved>",
  "modelAnswer": "<A concise ideal answer in 3-4 sentences>"
}

Be encouraging but honest. Be specific about what was strong and what was missing. Return ONLY the JSON object.`;

  const evaluation = await askJSON(model, prompt);

  // Persist evaluation to the session
  session.questions[questionIndex].answer = answer;
  session.questions[questionIndex].score = Math.min(10, Math.max(0, Number(evaluation.score) || 5));
  session.questions[questionIndex].feedback = evaluation.feedback || "";
  session.questions[questionIndex].modelAnswer = evaluation.modelAnswer || "";
  await session.save();

  res.json({
    success: true,
    score: session.questions[questionIndex].score,
    feedback: session.questions[questionIndex].feedback,
    modelAnswer: session.questions[questionIndex].modelAnswer,
  });
});

// ---------------------------------------------------------------------------
// POST /api/interview/complete
// Finalizes the session, computes grade, and generates a summary.
// Body: { sessionId }
// ---------------------------------------------------------------------------
const completeInterview = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) throw new ApiError(400, "BAD_REQUEST", "sessionId is required.");

  const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) throw new ApiError(404, "NOT_FOUND", "Interview session not found.");
  if (session.status === "completed") {
    // Already finalized — just return it
    return res.json({ success: true, session });
  }

  // Calculate overall score (average of per-question scores, scaled to 100)
  const answeredQs = session.questions.filter((q) => q.answer && q.answer.length > 0);
  const totalScore = answeredQs.reduce((sum, q) => sum + q.score, 0);
  const overallScore = answeredQs.length > 0 ? Math.round((totalScore / (answeredQs.length * 10)) * 100) : 0;

  // Determine grade
  let grade = "D";
  if (overallScore >= 90) grade = "A+";
  else if (overallScore >= 80) grade = "A";
  else if (overallScore >= 70) grade = "B+";
  else if (overallScore >= 60) grade = "B";
  else if (overallScore >= 45) grade = "C";

  // Ask Gemini for strengths & improvements summary
  const genAI = getGenAI();
  const model = getModel(genAI);

  const qaList = session.questions
    .map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer || "(not answered)"}\nScore: ${q.score}/10`)
    .join("\n\n");

  const prompt = `A candidate just completed a mock interview for "${session.role}" (${session.difficulty} level).
Here are their questions, answers, and scores:

${qaList}

Overall Score: ${overallScore}%

Analyze the performance and return a JSON object with:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"]
}

Each item should be a concise, actionable, specific bullet point (not generic advice). Return ONLY the JSON object.`;

  let strengths = ["Shows effort in answering"];
  let improvements = ["Practice more domain-specific questions"];

  try {
    const summary = await askJSON(model, prompt);
    if (Array.isArray(summary.strengths)) strengths = summary.strengths;
    if (Array.isArray(summary.improvements)) improvements = summary.improvements;
  } catch {
    // If AI summary fails, use defaults above
  }

  session.overallScore = overallScore;
  session.grade = grade;
  session.strengths = strengths;
  session.improvements = improvements;
  session.status = "completed";
  await session.save();

  res.json({ success: true, session });
});

// ---------------------------------------------------------------------------
// GET /api/interview/history
// Returns the logged-in candidate's past completed interview sessions.
// ---------------------------------------------------------------------------
const getHistory = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find({
    user: req.user._id,
    status: "completed",
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("role difficulty overallScore grade createdAt");

  res.json({ success: true, sessions });
});

module.exports = { startInterview, evaluateAnswer, completeInterview, getHistory };
