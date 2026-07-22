import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROUTES } from "../../routes/routerpath.jsx";
import FormField from "./FormField.jsx";

export default function CandidateLoginForm() {
  const { login, error, fieldErrors, submitting, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const update = (key) => (e) => { clearError(); setForm((f) => ({ ...f, [key]: e.target.value })); };

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login("candidate", form);
    if (ok) navigate(ROUTES.HOME);
  };

  return (
    <form onSubmit={submit} noValidate>
      <h2 className="font-display font-bold text-2xl text-navy">Welcome back</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Log in to track applications and get matched to new roles.</p>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <FormField id="email" label="Email address" type="email" icon={Mail} autoComplete="email" value={form.email} onChange={update("email")} placeholder="you@example.com" error={fieldErrors.email} />
        <FormField id="password" label="Password" type="password" icon={Lock} autoComplete="current-password" value={form.password} onChange={update("password")} placeholder="••••••••" error={fieldErrors.password} />
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <label className="flex items-center gap-2 text-text-muted">
          <input type="checkbox" className="rounded border-border" /> Remember me
        </label>
        <a href="#reset" className="font-medium text-violet hover:underline">Forgot password?</a>
      </div>

      <button type="submit" disabled={submitting} className="w-full mt-6 bg-gold text-navy font-semibold text-sm rounded-xl py-3 hover:brightness-105 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? "Logging in…" : "Log in"}
      </button>

      <p className="text-sm text-text-muted text-center mt-6">
        New to CareerHub?{" "}
        <Link to={ROUTES.CANDIDATE_REGISTER} className="font-semibold text-navy hover:underline">Create an account</Link>
      </p>
      <p className="text-sm text-text-muted text-center mt-2">
        Hiring instead?{" "}
        <Link to={ROUTES.EMPLOYER_LOGIN} className="font-semibold text-violet hover:underline">Employer login</Link>
      </p>
    </form>
  );
}
