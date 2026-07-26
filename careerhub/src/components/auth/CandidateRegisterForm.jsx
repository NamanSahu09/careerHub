import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROUTES } from "../../routes/routerpath.jsx";
import FormField from "./FormField.jsx";

export default function CandidateRegisterForm() {
  const { register, error, fieldErrors, submitting, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

  const update = (key) => (e) => { clearError(); setForm((f) => ({ ...f, [key]: e.target.value })); };

  const submit = async (e) => {
    e.preventDefault();
    const ok = await register("candidate", form);
    if (ok) navigate(ROUTES.HOME);
  };

  return (
    <form onSubmit={submit} noValidate>
      <h2 className="font-display font-bold text-2xl text-navy">Create your profile</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">One profile, matched against every relevant opening.</p>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <FormField id="name" label="Full name" icon={User} autoComplete="name" value={form.name} onChange={update("name")} placeholder="Priya Nair" error={fieldErrors.name} />
        <FormField id="email" label="Email address" type="email" icon={Mail} autoComplete="email" value={form.email} onChange={update("email")} placeholder="you@example.com" error={fieldErrors.email} />
        <FormField id="phone" label="Phone number" type="tel" icon={Phone} autoComplete="tel" value={form.phone} onChange={update("phone")} placeholder="10-digit mobile number" error={fieldErrors.phone} />
        <FormField id="password" label="Password" type="password" icon={Lock} autoComplete="new-password" value={form.password} onChange={update("password")} placeholder="8-15 characters, letters + numbers" error={fieldErrors.password} />
        <FormField id="confirmPassword" label="Confirm password" type="password" icon={Lock} autoComplete="new-password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Re-enter password" error={fieldErrors.confirmPassword} />
      </div>

      <p className="text-xs text-text-muted mt-4">
        By creating an account you agree to our Terms and Privacy Policy.
      </p>

      <button type="submit" disabled={submitting} className="w-full mt-4 bg-gold text-navy font-semibold text-sm rounded-xl py-3 hover:brightness-105 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-sm text-text-muted text-center mt-6">
        Already have an account?{" "}
        <Link to={ROUTES.CANDIDATE_LOGIN} className="font-semibold text-navy hover:underline">Log in</Link>
      </p>
      <p className="text-sm text-text-muted text-center mt-2">
        Hiring instead?{" "}
        <Link to={ROUTES.EMPLOYER_REGISTER} className="font-semibold text-violet hover:underline">Register as an employer</Link>
      </p>
    </form>
  );
}
