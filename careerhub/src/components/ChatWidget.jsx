import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, ChevronDown, Sparkles, User } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const WELCOME_MSG = {
  id: "welcome",
  role: "bot",
  text: "👋 Hi! I'm **CareerBot**, your AI career advisor.\n\nI can help you with:\n• Resume tips & interview prep\n• Job search strategies\n• Career path guidance\n• In-demand skills to learn\n\nWhat would you like to know today?",
  ts: Date.now(),
};

const QUICK_PROMPTS = [
  "How do I write a strong resume?",
  "What skills are in demand in 2025?",
  "How to prepare for a fresher interview?",
  "Tips to get my first job with no experience",
];

/** Local Career Intelligence knowledge engine for offline / standalone mode */
function getLocalCareerAdvice(query) {
  const q = query.toLowerCase();

  if (q.includes("resume") || q.includes("cv") || q.includes("biodata")) {
    return (
      "Here is how to create a standout **ATS-friendly resume**:\n\n" +
      "• **Use the Google XYZ Formula**: Frame accomplishments as *'Accomplished [X] as measured by [Y], by doing [Z]'*.\n" +
      "• **Quantify Impact**: Include numbers, percentages, and tangible outcomes (e.g. *'Improved API latency by 35%'*).\n" +
      "• **ATS Optimization**: Mirror key terms from the job description and keep a clean single-column format.\n" +
      "• **Highlight Top Projects**: For tech roles, link live demos and well-documented GitHub repositories.\n" +
      "• **Keep it concise**: 1 page for 0-4 years experience, max 2 pages for senior roles.\n\n" +
      "💡 *Tip: Check out CareerHub's built-in **Resume Builder** under your candidate profile to generate a professional PDF instantly!*"
    );
  }

  if (q.includes("interview") || q.includes("prepare") || q.includes("hr round") || q.includes("mock")) {
    return (
      "Here is a winning game plan for your **interview preparation**:\n\n" +
      "• **Master the STAR Method**: Structure behavioral answers with **Situation, Task, Action, and Result**.\n" +
      "• **Core Technical Fundamentals**: Brush up on DSA, System Design, OOPs, DBMS, and practical problem-solving.\n" +
      "• **Know the Company**: Research their product, target audience, recent press, and tech stack beforehand.\n" +
      "• **Ask High-Impact Questions**: Close the interview by asking *'What does success look like in the first 90 days?'* or *'What is the biggest challenge the team is currently solving?'*\n" +
      "• **Live Practice**: Rehearse out loud to build confidence and articulate your thought process clearly.\n\n" +
      "🎯 *Tip: Practice with our **AI Mock Interview Simulator** on CareerHub to get scored in real-time!*"
    );
  }

  if (q.includes("skill") || q.includes("demand") || q.includes("tech stack") || q.includes("learn") || q.includes("2025") || q.includes("2026")) {
    return (
      "Here are the **most in-demand tech skills** driving the job market:\n\n" +
      "• **Full Stack & Web**: React 18/19, Next.js (App Router), TypeScript, Tailwind CSS, Node.js, Go.\n" +
      "• **AI & LLM Engineering**: Python, LangChain, RAG architecture, Vector DBs (Pinecone, Chroma), OpenAI & Gemini APIs.\n" +
      "• **Cloud & DevOps**: Docker, Kubernetes, AWS/GCP, CI/CD pipelines, Terraform.\n" +
      "• **Data & Databases**: PostgreSQL, MongoDB, Redis caching, Kafka message streaming.\n" +
      "• **System Architecture**: Microservices, REST & GraphQL APIs, authentication, and secure design patterns."
    );
  }

  if (q.includes("fresher") || q.includes("first job") || q.includes("no experience") || q.includes("beginner") || q.includes("intern")) {
    return (
      "Breaking into tech with **no prior experience**? Here is your step-by-step roadmap:\n\n" +
      "• **Build 2-3 High-Quality Full Stack Projects**: Don't build generic to-do apps. Build complete products with auth, database, and live deployment.\n" +
      "• **Proof of Work on GitHub**: Write clear `README.md` files with screenshots, architecture diagrams, and live demo links.\n" +
      "• **Contribute to Open Source**: Find good first issues on popular open source repositories to prove real collaboration skills.\n" +
      "• **Network Proactively**: Reach out to founders and engineering managers on LinkedIn with personalized, value-first messages.\n" +
      "• **Leverage Internships & Contract Roles**: Stepping stones often convert into full-time high-paying offers quickly."
    );
  }

  if (q.includes("salary") || q.includes("negotiat") || q.includes("ctc") || q.includes("lpa") || q.includes("pay")) {
    return (
      "Here are essential strategies for **Salary Negotiation**:\n\n" +
      "• **Know Market Benchmarks**: Use CareerHub's Salary Guide, Glassdoor, and AmbitionBox to check median pay for your role and experience level.\n" +
      "• **Evaluate Total CTC**: Look at fixed base salary, variable performance bonus, ESOPs/stocks, joining bonuses, and benefits.\n" +
      "• **Delay Stating a Number Early**: If asked expectations early, reply: *'I am looking for a competitive offer aligned with the market rate for this level.'*\n" +
      "• **Counter Professionally**: Once an offer is made, justify your target with your technical strengths and unique domain experience."
    );
  }

  if (q.includes("switch") || q.includes("transition") || q.includes("career change")) {
    return (
      "Navigating a **career transition** successfully:\n\n" +
      "• **Map Transferable Skills**: Identify competencies from your previous domain (problem-solving, project management, domain knowledge) that apply to tech.\n" +
      "• **Create Bridge Projects**: Build apps that solve real-world problems in your previous industry using your new tech stack.\n" +
      "• **Reframe Your Story**: Present your background as a unique superpower rather than a detour in your interviews.\n" +
      "• **Target Hybrid Roles**: Look for roles where your previous domain expertise gives you an edge (e.g., FinTech, HealthTech, EdTech)."
    );
  }

  if (q.includes("apply") || q.includes("post") || q.includes("job") || q.includes("portal") || q.includes("careerhub")) {
    return (
      "Welcome to **CareerHub**! Here is what you can do:\n\n" +
      "• **Explore Jobs**: Search thousands of live listings by role, company, location, and salary filter.\n" +
      "• **AI Mock Interview**: Test your skills with an interactive AI interviewer and get instant report cards.\n" +
      "• **Resume Builder**: Generate clean, professional resumes tailored for hiring managers.\n" +
      "• **For Employers**: Post open roles and search verified candidate profiles directly.\n\n" +
      "What specific opportunity or guidance are you looking for?"
    );
  }

  // Default intelligent assistant response
  return (
    `Here is advice regarding **${query.slice(0, 50)}**:\n\n` +
    "• **Strategic Planning**: Clearly define your 3-month and 6-month career goals with measurable milestones.\n" +
    "• **Hands-on Execution**: Prioritize practical building and continuous coding over passive video watching.\n" +
    "• **Continuous Feedback**: Review and benchmark your performance using industry assessments and mock interviews.\n" +
    "• **Network & Visibility**: Share your learning in public on LinkedIn and GitHub to attract recruiters organically.\n\n" +
    "Feel free to ask me for specific resume tips, interview questions, or skill roadmaps!"
  );
}

/** Streams local fallback response chunk-by-chunk */
async function streamLocalResponse(message, onChunk, onDone) {
  const fullText = getLocalCareerAdvice(message);
  // Split into natural word/line tokens for realistic typing feel
  const chunks = fullText.match(/(\S+\s*|\n+)/g) || [fullText];
  for (let i = 0; i < chunks.length; i++) {
    onChunk(chunks[i]);
    await new Promise((r) => setTimeout(r, 18));
  }
  onDone();
}

/** Streaming fetch using ReadableStream / SSE with seamless offline fallback */
async function streamChat(message, history, onChunk, onDone, onError) {
  try {
    const payload = {
      message,
      history: history
        .filter((m) => m.role !== "bot" || m.id !== "welcome")
        .map((m) => ({ role: m.role === "bot" ? "model" : "user", text: m.text })),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    let response;
    try {
      response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch {
      clearTimeout(timeoutId);
      // Backend is offline / unreachable -> fallback to local AI engine
      return streamLocalResponse(message, onChunk, onDone);
    }

    if (!response.ok) {
      return streamLocalResponse(message, onChunk, onDone);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return streamLocalResponse(message, onChunk, onDone);
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let currentEvent = "";
    let hasYieldedChunk = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("event: ")) {
          currentEvent = trimmedLine.slice(7).trim();
        } else if (trimmedLine.startsWith("data: ")) {
          try {
            const json = JSON.parse(trimmedLine.slice(6));
            if (currentEvent === "error") {
              if (!hasYieldedChunk) {
                return streamLocalResponse(message, onChunk, onDone);
              }
              onError(json.message || "Something went wrong.");
              return;
            }
            if (json.text) {
              hasYieldedChunk = true;
              onChunk(json.text);
            }
            if (json.message === "Stream complete") {
              onDone();
              return;
            }
          } catch {}
        }
      }
    }
    onDone();
  } catch (err) {
    try {
      return streamLocalResponse(message, onChunk, onDone);
    } catch {
      onError("Unable to connect. Please try again.");
    }
  }
}

/** Render markdown-lite: **bold**, bullet lines */
function renderText(raw) {
  if (!raw) return null;
  const lines = raw.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trimStart();
    const isBullet = trimmed.startsWith("• ") || trimmed.startsWith("- ");
    const content = isBullet ? trimmed.slice(2) : trimmed;
    const parts = content.split(/\*\*([^*]+)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
    return isBullet ? (
      <li key={i} className="ch-chat-bullet">{parts}</li>
    ) : (
      <span key={i} className={i > 0 ? "ch-chat-line" : ""}>{parts}</span>
    );
  });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const addBotChunk = useCallback((text) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "bot" && last.streaming) {
        return [...prev.slice(0, -1), { ...last, text: last.text + text }];
      }
      return prev;
    });
  }, []);

  const send = useCallback(
    async (text) => {
      const msg = (text || input).trim();
      if (!msg || streaming) return;
      setInput("");

      const userMsg = { id: Date.now(), role: "user", text: msg, ts: Date.now() };
      const botPlaceholder = {
        id: Date.now() + 1,
        role: "bot",
        text: "",
        ts: Date.now(),
        streaming: true,
      };

      setMessages((prev) => [...prev, userMsg, botPlaceholder]);
      setStreaming(true);
      if (!open) setHasNew(true);

      try {
        await streamChat(
          msg,
          messages,
          addBotChunk,
          () => {
            setStreaming(false);
            setMessages((prev) =>
              prev.map((m) => (m.streaming ? { ...m, streaming: false } : m))
            );
          },
          (errMsg) => {
            setStreaming(false);
            setMessages((prev) =>
              prev.map((m) =>
                m.streaming ? { ...m, text: `⚠️ ${errMsg}`, streaming: false } : m
              )
            );
          }
        );
      } catch (err) {
        setStreaming(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.streaming ? { ...m, text: "⚠️ Something went wrong. Please try again.", streaming: false } : m
          )
        );
      }
    },
    [input, streaming, messages, addBotChunk, open]
  );

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* ── Floating Bubble ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open CareerBot"
        className="ch-chat-fab"
      >
        {open ? (
          <ChevronDown size={22} />
        ) : (
          <>
            <Bot size={22} />
            {hasNew && <span className="ch-chat-badge" />}
          </>
        )}
        {/* Pulse rings */}
        {!open && (
          <>
            <span className="ch-fab-ring ch-fab-ring-1" />
            <span className="ch-fab-ring ch-fab-ring-2" />
          </>
        )}
      </button>

      {/* ── Chat Panel ──────────────────────────────────────────────── */}
      {open && (
        <div className="ch-chat-panel" role="dialog" aria-label="CareerBot chat">
          {/* Header */}
          <div className="ch-chat-header">
            <div className="ch-chat-header-left">
              <div className="ch-chat-avatar">
                <Bot size={16} />
              </div>
              <div>
                <p className="ch-chat-header-name">CareerBot</p>
                <span className="ch-chat-status">
                  <span className="ch-status-dot" />
                  {streaming ? "Typing…" : "Online"}
                </span>
              </div>
            </div>
            <div className="ch-chat-header-right">
              <span className="ch-chat-powered">Powered by Gemini AI</span>
              <button onClick={() => setOpen(false)} className="ch-chat-close" aria-label="Close">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="ch-chat-messages scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ch-chat-row ${msg.role === "user" ? "ch-chat-row--user" : ""}`}
              >
                {msg.role === "bot" && (
                  <div className="ch-chat-bot-icon">
                    <Sparkles size={12} />
                  </div>
                )}
                <div
                  className={`ch-chat-bubble ${
                    msg.role === "user" ? "ch-bubble--user" : "ch-bubble--bot"
                  }`}
                >
                  <ul className="ch-bullet-list">{renderText(msg.text)}</ul>
                  {msg.streaming && (
                    <span className="ch-cursor" />
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="ch-chat-user-icon">
                    <User size={12} />
                  </div>
                )}
              </div>
            ))}

            {/* Thinking dots — shows ONLY if last message is bot but text is empty */}
            {streaming &&
              messages[messages.length - 1]?.role === "bot" &&
              messages[messages.length - 1]?.text === "" && (
                <div className="ch-chat-row">
                  <div className="ch-chat-bot-icon">
                    <Sparkles size={12} />
                  </div>
                  <div className="ch-bubble--bot ch-chat-bubble">
                    <div className="ch-typing-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="ch-quick-prompts">
              {QUICK_PROMPTS.map((q) => (
                <button key={q} onClick={() => send(q)} className="ch-quick-btn">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="ch-chat-input-row">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask CareerBot anything…"
              disabled={streaming}
              className="ch-chat-textarea"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || streaming}
              className="ch-send-btn"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="ch-chat-footer">AI career assistant. Powered by CareerHub intelligence.</p>
        </div>
      )}
    </>
  );
}

