const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT = `You are CareerBot, an expert career advisor integrated into CareerHub — India's leading student job portal.

Your role is to help students and fresh graduates with:
- Job search strategies and tips on how to use CareerHub effectively
- Resume writing and CV optimization advice
- Interview preparation (HR rounds, technical rounds, aptitude)
- Career path guidance (which domain to choose, how to grow)
- Understanding job descriptions and required skills
- Salary negotiation basics for freshers
- Internship vs full-time decisions
- In-demand skills to learn (programming languages, tools, certifications)
- How to stand out as a fresher with no experience
- LinkedIn profile and professional branding tips

Tone: Friendly, encouraging, concise, and practical. Use simple language since your audience is students.
Format: Use bullet points and short paragraphs. Keep responses under 200 words unless a detailed explanation is truly needed.
Context: You are embedded in a job portal in India. Be specific to the Indian job market when relevant.

If asked about anything unrelated to careers, jobs, skills, or education, politely redirect the user back to career topics.
Start every first response with a warm greeting only if the conversation is just beginning.`;

/**
 * POST /api/chat
 * Streams a Gemini response via Server-Sent Events.
 * Body: { message: string, history: [{role, parts}][] }
 */
async function chat(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    return res.status(503).json({
      success: false,
      code: "CHATBOT_UNAVAILABLE",
      message: "CareerBot is not configured yet. Add GEMINI_API_KEY to your .env file.",
    });
  }

  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  // Set up SSE headers so text streams to the browser in real time
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering if behind a proxy
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert stored history to Gemini's expected format
    const geminiHistory = history.map((msg) => ({
      role: msg.role, // "user" or "model"
      parts: [{ text: msg.text }],
    }));

    const chatSession = model.startChat({ history: geminiHistory });
    const result = await chatSession.sendMessageStream(message.trim());

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        send("chunk", { text });
      }
    }

    send("done", { message: "Stream complete" });
    res.end();
  } catch (err) {
    console.error("[chat] Gemini error:", err.message);
    send("error", { message: "CareerBot is having trouble right now. Please try again in a moment." });
    res.end();
  }
}

module.exports = { chat };
