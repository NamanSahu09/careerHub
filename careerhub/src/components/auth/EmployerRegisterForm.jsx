import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROUTES } from "../../routes/routerpath.jsx";
import FormField from "./FormField.jsx";

export default function EmployerRegisterForm() {
  const { register, error, fieldErrors, submitting, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", companyName: "", email: "", phone: "", password: "", confirmPassword: "" });

  const update = (key) => (e) => { clearError(); setForm((f) => ({ ...f, [key]: e.target.value })); };

  const submit = async (e) => {
    e.preventDefault();
    const ok = await register("employer", form);
    if (ok) navigate(ROUTES.POST_JOB);
  };

  return (
    <form onSubmit={submit} noValidate>
      <h2 className="font-display font-bold text-2xl text-navy">Register your company</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Post openings and reach candidates across India.</p>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <FormField id="name" label="Your name" icon={User} autoComplete="name" value={form.name} onChange={update("name")} placeholder="Recruiter or founder name" error={fieldErrors.name} />
        <FormField id="companyName" label="Company name" icon={Building2} autoComplete="organization" value={form.companyName} onChange={update("companyName")} placeholder="Nimbus Systems" error={fieldErrors.companyName} />
        <FormField id="email" label="Work email" type="email" icon={Mail} autoComplete="email" value={form.email} onChange={update("email")} placeholder="you@company.com" error={fieldErrors.email} />
        <FormField id="phone" label="Phone number" type="tel" icon={Phone} autoComplete="tel" value={form.phone} onChange={update("phone")} placeholder="10-digit mobile number" error={fieldErrors.phone} />
        <FormField id="password" label="Password" type="password" icon={Lock} autoComplete="new-password" value={form.password} onChange={update("password")} placeholder="8-15 characters, letters + numbers" error={fieldErrors.password} />
        <FormField id="confirmPassword" label="Confirm password" type="password" icon={Lock} autoComplete="new-password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Re-enter password" error={fieldErrors.confirmPassword} />
      </div>

      <p className="text-xs text-text-muted mt-4">
        By registering you agree to our Terms and Privacy Policy.
      </p>

      <button type="submit" disabled={submitting} className="w-full mt-4 bg-violet text-white font-semibold text-sm rounded-xl py-3 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? "Creating account…" : "Create company account"}
      </button>

      <p className="text-sm text-text-muted text-center mt-6">
        Already registered?{" "}
        <Link to={ROUTES.EMPLOYER_LOGIN} className="font-semibold text-navy hover:underline">Log in</Link>
      </p>
      <p className="text-sm text-text-muted text-center mt-2">
        Looking for a job instead?{" "}
        <Link to={ROUTES.CANDIDATE_REGISTER} className="font-semibold text-violet hover:underline">Candidate sign up</Link>
      </p>
    </form>
  );
}
