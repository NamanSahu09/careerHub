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

/** Render markdown-lite: **bold**, bullet lines */
function renderText(raw) {
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

/** Streaming fetch using ReadableStream / SSE */
async function streamChat(message, history, onChunk, onDone, onError) {
  const payload = {
    message,
    history: history
      .filter((m) => m.role !== "bot" || m.id !== "welcome")
      .map((m) => ({ role: m.role === "bot" ? "model" : "user", text: m.text })),
  };

  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    onError(data.message || "Something went wrong.");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const json = JSON.parse(line.slice(6));
          if (json.text) onChunk(json.text);
          if (json.message === "Stream complete") onDone();
        } catch {}
      }
      if (line.startsWith("event: error")) {
        // next data line will have the error
      }
    }
  }
  onDone();
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

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
              <span className="ch-chat-powered">Powered by Gemini</span>
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
          <p className="ch-chat-footer">AI can make mistakes. Verify important info.</p>
        </div>
      )}
    </>
  );
}
