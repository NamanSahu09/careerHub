const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Password rule: 8-15 characters, at least one letter and one number.
 * Enforced again here (not just in the request validator) so the schema
 * stays safe even if a document is created from a script/seed/console.
 */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_\-]{8,15}$/;

/** Exactly 10 digits, numbers only — matches Indian mobile numbers. */
const PHONE_REGEX = /^[0-9]{10}$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name must be under 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "Enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [PHONE_REGEX, "Phone number must be exactly 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never returned by default on find()
    },
    role: {
      type: String,
      enum: {
        values: ["candidate", "employer", "admin"],
        message: "Role must be candidate, employer, or admin",
      },
      required: true,
      default: "candidate",
    },
    companyName: {
      type: String,
      trim: true,
      required: [
        function requiredForEmployer() {
          return this.role === "employer";
        },
        "Company name is required for employer accounts",
      ],
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

// Hash password on create/change only — never re-hash an already-hashed value.
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  if (!PASSWORD_REGEX.test(this.password)) {
    return next(
      new Error(
        "Password must be 8-15 characters and include at least one letter and one number"
      )
    );
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isLocked = function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    companyName: this.companyName,
    createdAt: this.createdAt,
  };
};

userSchema.statics.PASSWORD_REGEX = PASSWORD_REGEX;
userSchema.statics.PHONE_REGEX = PHONE_REGEX;

module.exports = mongoose.model("User", userSchema);
