require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[server] CareerHub API running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });

  // Fail loudly instead of leaving the process in a half-broken state.
  process.on("unhandledRejection", (err) => {
    console.error("[server] Unhandled promise rejection:", err);
    server.close(() => process.exit(1));
  });
}

start();
