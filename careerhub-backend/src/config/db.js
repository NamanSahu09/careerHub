const mongoose = require("mongoose");

/**
 * Connects to MongoDB. Fails loudly and exits on error so container
 * orchestrators / process managers restart the service rather than run
 * with a dead DB connection.
 */
let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("[db] MONGO_URI is not set. Check your .env file or environment variables.");
    if (process.env.NODE_ENV !== "production") process.exit(1);
    return;
  }

  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`[db] MongoDB connection failed: ${err.message}`);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[db] MongoDB disconnected");
});

module.exports = connectDB;
