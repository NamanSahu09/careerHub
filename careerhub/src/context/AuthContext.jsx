import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { authApi } from "../api/authApi.js";
import { parseApiError } from "../api/apiError.js";

/**
 * Talks to the real Express/MongoDB backend. The JWT lives in an httpOnly
 * cookie set by the server (see careerhub-backend/src/utils/generateToken.js)
 * — this context only ever holds the *user object*, never a token, so
 * there is nothing here for injected/XSS JS to steal.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true); // restoring session on first load
  const [submitting, setSubmitting] = useState(false);

  // On mount: ask the backend "who am I?" using the cookie the browser
  // already has. If it's missing/expired, /auth/me 401s and we just stay
  // logged out — that's expected, not an error worth surfacing.
  useEffect(() => {
    let cancelled = false;
    authApi
      .me()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const clearError = useCallback(() => {
    setError("");
    setFieldErrors({});
  }, []);

  const applyApiError = (err) => {
    const parsed = parseApiError(err);
    setError(parsed.message);
    setFieldErrors(Object.fromEntries(parsed.errors.map((e) => [e.field, e.message])));
    return parsed;
  };

  const login = useCallback(async (role, { email, password }) => {
    setError("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      const data = await authApi.login({ email, password, role });
      setUser(data.user);
      return true;
    } catch (err) {
      applyApiError(err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const register = useCallback(async (role, form) => {
    setError("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      const data =
        role === "employer"
          ? await authApi.registerEmployer({ ...payload, companyName: form.companyName })
          : await authApi.registerCandidate(payload);
      setUser(data.user);
      return true;
    } catch (err) {
      applyApiError(err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // even if the network call fails, drop the client-side user so the UI
      // reflects "logged out" — the cookie will simply expire naturally.
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, error, fieldErrors, loading, submitting, login, register, logout, clearError }),
    [user, error, fieldErrors, loading, submitting, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
