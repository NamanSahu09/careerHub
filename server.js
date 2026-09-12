const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "careerhub-backend/.env") });
const app = require("./careerhub-backend/src/app");
const connectDB = require("./careerhub-backend/src/config/db");

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[server] CareerHub API running on port ${PORT}`);
    });
  });
} else {
  connectDB().catch((err) => console.error("[server] DB connection error:", err));
}

module.exports = app;
