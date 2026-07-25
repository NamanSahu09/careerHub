const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const path = require("path");

const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Trust the first proxy hop (needed for correct req.ip behind e.g. Render/Heroku/Nginx/ngrok)
app.set("trust proxy", 1);

// --- Security middleware -----------------------------------------------
// Relax helmet's CSP so the served React app can load its own assets
app.use(
  helmet({
    contentSecurityPolicy: false, // React bundles use inline scripts
  })
);

// CORS — allow localhost dev origins AND the ngrok public URL
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];
if (process.env.NGROK_URL) allowedOrigins.push(process.env.NGROK_URL);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server (no origin)
      if (!origin) return cb(null, true);
      
      // Allow whitelisted origins
      if (allowedOrigins.includes(origin)) return cb(null, true);
      
      // Allow any *.ngrok-free.app / *.ngrok.io / *.serveousercontent.com
      if (
        origin.match(/\.ngrok(-free)?\.app$/) || 
        origin.match(/\.ngrok\.io$/) ||
        origin.match(/\.serveousercontent\.com$/)
      ) {
        return cb(null, true);
      }

      // Allow localhost or 127.0.0.1 on any port (dev/proxy)
      if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return cb(null, true);
      }

      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true, // allow the httpOnly auth cookie to be sent
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

// General API rate limit
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// --- API Routes -----------------------------------------------------------
app.use("/api", routes);

// --- Serve built React frontend (if dist/ exists) -------------------------
const FRONTEND_DIST = path.resolve(__dirname, "../../careerhub/dist");
const fs = require("fs");

if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));

  // SPA fallback — any non-API route returns index.html so React Router works
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });

  console.log(`[server] Serving built frontend from ${FRONTEND_DIST}`);
} else {
  // --- 404 for unknown API routes when no dist ----------------------------
  app.use(notFound);
}

app.use(errorHandler);

module.exports = app;

