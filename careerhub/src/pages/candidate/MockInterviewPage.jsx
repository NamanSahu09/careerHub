import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Mic, Brain, Target, ChevronRight, RotateCcw, ArrowLeft,
  CheckCircle2, AlertTriangle, TrendingUp, BookOpen, Sparkles, Loader2,
} from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { ROUTES } from "../../routes/routerpath.jsx";
import {
  startInterview,
  evaluateAnswer,
  completeInterview,
  getInterviewHistory,
} from "../../api/interviewApi.js";

// ── Available roles for the interview selector ──────────────────────────
const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile App Developer",
  "Machine Learning Engineer",
  "QA / Test Engineer",
  "Business Analyst",
  "Cloud Architect",
  "Cybersecurity Analyst",
];

const DIFFICULTIES = ["Fresher", "Mid", "Senior"];

// ── Grade color helper ──────────────────────────────────────────────────
function gradeColor(grade) {
  if (grade === "A+" || grade === "A") return "text-teal";
  if (grade === "B+" || grade === "B") return "text-violet";
  if (grade === "C") return "text-gold";
  return "text-red-500";
}

function gradeBg(grade) {
  if (grade === "A+" || grade === "A") return "bg-teal/10 border-teal/30";
  if (grade === "B+" || grade === "B") return "bg-violet/10 border-violet/30";
  if (grade === "C") return "bg-gold/10 border-gold/30";
  return "bg-red-50 border-red-200";
}

// ── Animated circular score gauge ───────────────────────────────────────
function ScoreGauge({ score, size = 160 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "#ef4444";
  if (score >= 80) color = "#10b981";
  else if (score >= 60) color = "#7c5cfc";
  else if (score >= 45) color = "#f5a623";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={10}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-3xl text-navy">{score}%</span>
        <span className="text-[10px] text-text-muted font-medium">Overall</span>
      </div>
    </div>
  );
}

// ── Mini score bar for individual questions ──────────────────────────────
function MiniScoreBar({ score }) {
  let color = "bg-red-400";
  if (score >= 8) color = "bg-teal";
  else if (score >= 6) color = "bg-violet";
  else if (score >= 4) color = "bg-gold";

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score * 10}%`, transition: "width 0.8s ease" }} />
      </div>
      <span className="font-bold text-navy font-mono-num">{score}/10</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════
export default function MockInterviewPage() {
  // Phase: "setup" | "interview" | "report"
  const [phase, setPhase] = useState("setup");

  // Setup state
  const [role, setRole] = useState(ROLES[0]);
  const [difficulty, setDifficulty] = useState("Fresher");

  // Interview state
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluations, setEvaluations] = useState([]); // [{score, feedback, modelAnswer}]
  const [showFeedback, setShowFeedback] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Report state
  const [report, setReport] = useState(null);

  // History state
  const [history, setHistory] = useState([]);

  // Loading states
  const [startLoading, setStartLoading] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch history on mount
  useEffect(() => {
    getInterviewHistory()
      .then((res) => setHistory(res.data.sessions || []))
      .catch(() => {});
  }, []);

  // ── Phase 1: Start Interview ─────────────────────────────────────────
  async function handleStart() {
    setError("");
    setStartLoading(true);
    try {
      const res = await startInterview(role, difficulty);
      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
      setEvaluations([]);
      setCurrentQ(0);
      setAnswer("");
      setShowFeedback(false);
      setShowModelAnswer(false);
      setPhase("interview");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start interview. Try again.");
    } finally {
      setStartLoading(false);
    }
  }

  // ── Phase 2: Submit Answer ───────────────────────────────────────────
  async function handleSubmitAnswer() {
    if (!answer.trim()) return;
    setError("");
    setEvalLoading(true);
    try {
      const res = await evaluateAnswer(sessionId, currentQ, answer.trim());
      setEvaluations((prev) => [
        ...prev,
        { score: res.data.score, feedback: res.data.feedback, modelAnswer: res.data.modelAnswer },
      ]);
      setShowFeedback(true);
      setShowModelAnswer(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setEvalLoading(false);
    }
  }

  // ── Move to next question or complete ────────────────────────────────
  async function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setAnswer("");
      setShowFeedback(false);
      setShowModelAnswer(false);
    } else {
      // Last question → complete the session
      setCompleteLoading(true);
      setError("");
      try {
        const res = await completeInterview(sessionId);
        setReport(res.data.session);
        setPhase("report");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to generate report.");
      } finally {
        setCompleteLoading(false);
      }
    }
  }

  // ── Retake ───────────────────────────────────────────────────────────
  function handleRetake() {
    setPhase("setup");
    setSessionId(null);
    setQuestions([]);
    setEvaluations([]);
    setCurrentQ(0);
    setAnswer("");
    setReport(null);
    setError("");
    // Refresh history
    getInterviewHistory()
      .then((res) => setHistory(res.data.sessions || []))
      .catch(() => {});
  }

  const currentEval = evaluations[currentQ];

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <>
      <Helmet>
        <title>AI Mock Interview — CareerHub</title>
        <meta name="description" content="Practice job interviews with an AI interviewer. Get scored, get feedback, and level up your interview skills." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#F5F7FA] py-10 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">

          {/* ═══════════════════════════════════════════════════════════════
              PHASE 1: SETUP
          ═══════════════════════════════════════════════════════════════ */}
          {phase === "setup" && (
            <div className="animate-fadeIn">
              <header className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-violet bg-violet/10 rounded-full px-3.5 py-1.5 inline-flex items-center gap-1.5">
                  <Sparkles size={12} /> AI-Powered
                </span>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-navy mt-3">
                  Mock Interview Simulator
                </h1>
                <p className="text-text-muted text-sm mt-2 max-w-md mx-auto">
                  Practice with an AI interviewer that asks real questions, scores your answers, and generates a report card.
                </p>
              </header>

              <section className="bg-white rounded-2xl border border-border shadow-sm p-8 max-w-lg mx-auto">
                {/* Role Selector */}
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Select Job Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-navy bg-bg outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition mb-6"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                {/* Difficulty */}
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Difficulty Level
                </label>
                <div className="flex gap-3 mb-8">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
                        difficulty === d
                          ? "bg-navy text-white border-navy"
                          : "bg-bg text-text-muted border-border hover:border-navy/30"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
                    <AlertTriangle size={14} /> {error}
                  </p>
                )}

                <button
                  onClick={handleStart}
                  disabled={startLoading}
                  className="w-full bg-violet text-white font-semibold text-sm rounded-xl py-3.5 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {startLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating Questions...</>
                  ) : (
                    <><Mic size={16} /> Start Interview</>
                  )}
                </button>
              </section>

              {/* Past Interview History */}
              {history.length > 0 && (
                <section className="mt-12 max-w-lg mx-auto">
                  <h2 className="font-display font-bold text-lg text-navy mb-4 flex items-center gap-2">
                    <BookOpen size={18} /> Past Interviews
                  </h2>
                  <div className="space-y-3">
                    {history.map((s) => (
                      <div key={s._id} className="bg-white rounded-xl border border-border p-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-navy">{s.role}</p>
                          <p className="text-[10px] text-text-muted">{s.difficulty} · {new Date(s.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-display font-bold text-lg ${gradeColor(s.grade)}`}>{s.grade}</span>
                          <p className="text-[10px] text-text-muted font-mono-num">{s.overallScore}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              PHASE 2: INTERVIEW IN PROGRESS
          ═══════════════════════════════════════════════════════════════ */}
          {phase === "interview" && (
            <div className="animate-fadeIn">
              {/* Progress bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Brain size={18} className="text-violet" />
                  <span className="text-xs font-semibold text-text-muted">{role} · {difficulty}</span>
                </div>
                <span className="text-xs font-bold text-navy font-mono-num">
                  Q{currentQ + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full h-2 bg-border rounded-full mb-8 overflow-hidden">
                <div
                  className="h-full bg-violet rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <section className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 mb-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0 font-bold text-sm">
                    {currentQ + 1}
                  </div>
                  <h2 className="font-display font-semibold text-navy text-[15px] sm:text-base leading-relaxed">
                    {questions[currentQ]}
                  </h2>
                </div>

                {/* Answer textarea (hidden once feedback is shown) */}
                {!showFeedback && (
                  <>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here... Be specific and give examples where possible."
                      rows={6}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-navy bg-bg outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition resize-none placeholder:text-text-muted"
                    />

                    {error && (
                      <p className="text-xs text-red-500 mt-3 flex items-center gap-1">
                        <AlertTriangle size={12} /> {error}
                      </p>
                    )}

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={evalLoading || !answer.trim()}
                      className="mt-4 bg-navy text-white font-semibold text-sm rounded-xl px-6 py-3 hover:bg-navy-soft active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {evalLoading ? (
                        <><Loader2 size={14} className="animate-spin" /> Evaluating...</>
                      ) : (
                        <><Target size={14} /> Submit Answer</>
                      )}
                    </button>
                  </>
                )}

                {/* Feedback Panel */}
                {showFeedback && currentEval && (
                  <div className="animate-fadeIn space-y-5">
                    {/* Score badge */}
                    <div className="flex items-center justify-between bg-bg rounded-xl border border-border p-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">Your Score</p>
                        <MiniScoreBar score={currentEval.score} />
                      </div>
                      <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-display font-bold text-2xl ${
                        currentEval.score >= 8 ? "border-teal/30 bg-teal/10 text-teal"
                          : currentEval.score >= 6 ? "border-violet/30 bg-violet/10 text-violet"
                          : currentEval.score >= 4 ? "border-gold/30 bg-gold/10 text-gold"
                          : "border-red-200 bg-red-50 text-red-500"
                      }`}>
                        {currentEval.score}
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="bg-violet/5 border border-violet/15 rounded-xl p-4">
                      <h3 className="text-[10px] uppercase tracking-wider text-violet font-bold mb-2 flex items-center gap-1.5">
                        <Brain size={12} /> AI Feedback
                      </h3>
                      <p className="text-xs text-navy leading-relaxed">{currentEval.feedback}</p>
                    </div>

                    {/* Your answer (shown collapsed) */}
                    <div className="bg-bg border border-border rounded-xl p-4">
                      <h3 className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">Your Answer</h3>
                      <p className="text-xs text-text leading-relaxed">{answer}</p>
                    </div>

                    {/* Model Answer toggle */}
                    <button
                      onClick={() => setShowModelAnswer((v) => !v)}
                      className="text-xs font-semibold text-violet hover:text-navy flex items-center gap-1 transition"
                    >
                      <BookOpen size={13} /> {showModelAnswer ? "Hide" : "View"} Model Answer
                    </button>
                    {showModelAnswer && (
                      <div className="bg-teal/5 border border-teal/15 rounded-xl p-4 animate-fadeIn">
                        <h3 className="text-[10px] uppercase tracking-wider text-teal font-bold mb-2">Ideal Answer</h3>
                        <p className="text-xs text-navy leading-relaxed">{currentEval.modelAnswer}</p>
                      </div>
                    )}

                    {/* Next / Complete button */}
                    <button
                      onClick={handleNext}
                      disabled={completeLoading}
                      className="w-full bg-violet text-white font-semibold text-sm rounded-xl py-3.5 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {completeLoading ? (
                        <><Loader2 size={14} className="animate-spin" /> Generating Report Card...</>
                      ) : currentQ < questions.length - 1 ? (
                        <>Next Question <ChevronRight size={16} /></>
                      ) : (
                        <><CheckCircle2 size={16} /> View Report Card</>
                      )}
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              PHASE 3: REPORT CARD
          ═══════════════════════════════════════════════════════════════ */}
          {phase === "report" && report && (
            <div className="animate-fadeIn">
              <header className="text-center mb-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal bg-teal/10 rounded-full px-3.5 py-1.5">
                  Interview Complete
                </span>
                <h1 className="font-display font-bold text-3xl text-navy mt-3">
                  Your Report Card
                </h1>
                <p className="text-text-muted text-sm mt-1">{report.role} · {report.difficulty} Level</p>
              </header>

              {/* Score + Grade row */}
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-10">
                <ScoreGauge score={report.overallScore} />
                <div className={`border-2 rounded-2xl px-10 py-6 text-center ${gradeBg(report.grade)}`}>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">Grade</p>
                  <span className={`font-display font-bold text-5xl ${gradeColor(report.grade)}`}>{report.grade}</span>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <section className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-sm text-teal mb-4 flex items-center gap-2">
                    <TrendingUp size={16} /> Strengths
                  </h2>
                  <ul className="space-y-2.5">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-navy flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 size={14} className="text-teal shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-sm text-gold mb-4 flex items-center gap-2">
                    <Target size={16} /> Areas to Improve
                  </h2>
                  <ul className="space-y-2.5">
                    {report.improvements.map((s, i) => (
                      <li key={i} className="text-xs text-navy flex items-start gap-2 leading-relaxed">
                        <AlertTriangle size={14} className="text-gold shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Per-question breakdown */}
              <section className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-10">
                <h2 className="font-semibold text-sm text-navy mb-5">Question-by-Question Breakdown</h2>
                <div className="space-y-4">
                  {report.questions.map((q, i) => (
                    <div key={i} className="flex items-start gap-3 bg-bg rounded-xl p-4 border border-border">
                      <div className="w-7 h-7 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0 font-bold text-xs">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-navy leading-relaxed line-clamp-2">{q.question}</p>
                        <div className="mt-2">
                          <MiniScoreBar score={q.score} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRetake}
                  className="bg-violet text-white font-semibold text-sm rounded-xl px-8 py-3.5 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  <RotateCcw size={14} /> Practice Again
                </button>
                <Link
                  to={ROUTES.CANDIDATE_DASHBOARD}
                  className="bg-navy text-white font-semibold text-sm rounded-xl px-8 py-3.5 hover:bg-navy-soft active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} /> Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Inline animation keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out both;
        }
      `}</style>
    </>
  );
}
