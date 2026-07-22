import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROUTES } from "../../routes/routerpath.jsx";
import FormField from "./FormField.jsx";

export default function EmployerLoginForm() {
  const { login, error, fieldErrors, submitting, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const update = (key) => (e) => { clearError(); setForm((f) => ({ ...f, [key]: e.target.value })); };

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login("employer", form);
    if (ok) navigate(ROUTES.POST_JOB);
  };

  return (
    <form onSubmit={submit} noValidate>
      <h2 className="font-display font-bold text-2xl text-navy">Employer login</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Manage postings and review applicants.</p>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <FormField id="email" label="Work email" type="email" icon={Mail} autoComplete="email" value={form.email} onChange={update("email")} placeholder="you@company.com" error={fieldErrors.email} />
        <FormField id="password" label="Password" type="password" icon={Lock} autoComplete="current-password" value={form.password} onChange={update("password")} placeholder="••••••••" error={fieldErrors.password} />
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <label className="flex items-center gap-2 text-text-muted">
          <input type="checkbox" className="rounded border-border" /> Remember me
        </label>
        <a href="#reset" className="font-medium text-violet hover:underline">Forgot password?</a>
      </div>

      <button type="submit" disabled={submitting} className="w-full mt-6 bg-violet text-white font-semibold text-sm rounded-xl py-3 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? "Logging in…" : "Log in"}
      </button>

      <p className="text-sm text-text-muted text-center mt-6">
        New to hiring on CareerHub?{" "}
        <Link to={ROUTES.EMPLOYER_REGISTER} className="font-semibold text-navy hover:underline">Register your company</Link>
      </p>
      <p className="text-sm text-text-muted text-center mt-2">
        Looking for a job instead?{" "}
        <Link to={ROUTES.CANDIDATE_LOGIN} className="font-semibold text-violet hover:underline">Candidate login</Link>
      </p>
    </form>
  );
}
