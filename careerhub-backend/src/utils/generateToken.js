const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * httpOnly cookie options for storing the JWT. `secure` is forced on in
 * production so the cookie is never sent over plain HTTP. Using an
 * httpOnly cookie (rather than returning the token for the client to store
 * in localStorage) keeps the token inaccessible to injected/XSS JS.
 */
function cookieOptions() {
  const days = Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 7);
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: days * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

module.exports = { signToken, verifyToken, cookieOptions };
