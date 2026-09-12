const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB().catch((err) => console.error("[server] MongoDB connection error:", err));

module.exports = app;
