import axios from "axios";

/**
 * `withCredentials: true` is what makes the browser attach and accept the
 * httpOnly `token` cookie the backend sets on login/register — this is the
 * whole reason auth works without touching localStorage on the frontend.
 * The backend's CORS config (CLIENT_URL + credentials: true) must match
 * this origin or the browser will silently drop the cookie.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export default client;
