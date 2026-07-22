/**
 * Run with: npm run seed:admin
 * Creates (or updates) a single admin account from .env values.
 * This is the *only* way an admin account is created — there is no public
 * "register as admin" endpoint, intentionally.
 */
require("dotenv").config();
const connectDB = require("../src/config/db");
const User = require("../src/models/User");

async function run() {
  await connectDB();

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_PHONE) {
    console.error("[seed] Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE in .env first.");
    process.exit(1);
  }

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    existing.role = "admin";
    existing.isActive = true;
    await existing.save();
    console.log(`[seed] Existing user ${ADMIN_EMAIL} promoted to admin.`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`[seed] Admin account created: ${ADMIN_EMAIL}`);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
