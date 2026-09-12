const app = require("./careerhub-backend/src/app");
const connectDB = require("./careerhub-backend/src/config/db");

connectDB().catch((err) => console.error("[server] MongoDB connection error:", err));

module.exports = app;
