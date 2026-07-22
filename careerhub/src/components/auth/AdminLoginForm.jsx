import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROUTES } from "../../routes/routerpath.jsx";
import FormField from "./FormField.jsx";

export default function AdminLoginForm() {
  const { login, error, fieldErrors, submitting, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const update = (key) => (e) => { clearError(); setForm((f) => ({ ...f, [key]: e.target.value })); };

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login("admin", form);
    if (ok) navigate(ROUTES.ADMIN_DASHBOARD);
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="w-11 h-11 rounded-xl bg-navy text-gold flex items-center justify-center mb-5">
        <ShieldCheck size={22} />
      </div>
      <h2 className="font-display font-bold text-2xl text-navy">Admin portal</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Restricted access — CareerHub staff only.</p>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <FormField id="email" label="Admin email" type="email" icon={Mail} autoComplete="email" value={form.email} onChange={update("email")} placeholder="admin@careerhub.example" error={fieldErrors.email} />
        <FormField id="password" label="Password" type="password" icon={Lock} autoComplete="current-password" value={form.password} onChange={update("password")} placeholder="••••••••" error={fieldErrors.password} />
      </div>

      <button type="submit" disabled={submitting} className="w-full mt-6 bg-navy text-white font-semibold text-sm rounded-xl py-3 hover:bg-navy-soft active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? "Signing in…" : "Enter admin portal"}
      </button>

      <p className="text-xs text-text-muted text-center mt-5">
        Admin accounts are created via the backend seed script, not self-registration.
      </p>
    </form>
  );
}
