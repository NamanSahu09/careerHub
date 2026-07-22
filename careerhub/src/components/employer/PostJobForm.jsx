import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { jobsApi } from "../../api/jobsApi.js";
import { parseApiError, fieldErrorMap } from "../../api/apiError.js";

const MODES = ["On-site", "Hybrid", "Remote"];
const EXPERIENCE = ["0-1 yrs", "1-3 yrs", "2-5 yrs", "3-6 yrs", "4-7 yrs", "7+ yrs"];

const initialForm = {
  title: "",
  location: "",
  mode: "On-site",
  experience: "1-3 yrs",
  salaryMin: "",
  salaryMax: "",
  skills: "",
  description: "",
};

export default function PostJobForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key) => (e) => {
    setError("");
    setFieldErrors((f) => ({ ...f, [key]: undefined }));
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      const { job } = await jobsApi.create({
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setSubmitted(job);
      setForm(initialForm);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFieldErrors(fieldErrorMap(parsed.errors));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center max-w-lg mx-auto">
        <CheckCircle2 className="mx-auto text-teal" size={40} />
        <h2 className="font-display font-bold text-xl text-navy mt-4">Job posted</h2>
        <p className="text-sm text-text-muted mt-2">
          "{submitted.title}" is now live and visible to candidates searching {submitted.location || "your location"}.
        </p>
        <button
          onClick={() => setSubmitted(null)}
          className="mt-6 bg-navy text-white font-semibold text-sm rounded-xl px-5 py-2.5 hover:bg-navy-soft transition"
        >
          Post another job
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-border rounded-2xl p-6 sm:p-8 space-y-5 max-w-2xl mx-auto">
      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-navy mb-1.5">Job title</label>
        <input id="title" required value={form.title} onChange={update("title")} placeholder="e.g. Senior Frontend Engineer" className="w-full text-sm rounded-lg border border-border px-3.5 py-2.5 outline-none focus-visible:border-violet" />
        {fieldErrors.title && <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-navy mb-1.5">Location</label>
          <input id="location" required value={form.location} onChange={update("location")} placeholder="e.g. Bengaluru" className="w-full text-sm rounded-lg border border-border px-3.5 py-2.5 outline-none focus-visible:border-violet" />
          {fieldErrors.location && <p className="text-xs text-red-600 mt-1">{fieldErrors.location}</p>}
        </div>
        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-navy mb-1.5">Work mode</label>
          <select id="mode" value={form.mode} onChange={update("mode")} className="w-full text-sm rounded-lg border border-border px-3.5 py-2.5 outline-none focus-visible:border-violet bg-white">
            {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-navy mb-1.5">Experience</label>
          <select id="experience" value={form.experience} onChange={update("experience")} className="w-full text-sm rounded-lg border border-border px-3.5 py-2.5 outline-none focus-visible:border-violet bg-white">
            {EXPERIENCE.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="salaryMin" className="block text-sm font-medium text-navy mb-1.5">Min salary (LPA)</label>
          <input id="salaryMin" type="number" min="0" value={form.salaryMin} onChange={update("salaryMin")} placeholder="8" className="w-full text-sm rounded-lg border border-border px-3.5 py-2.5 outline-none focus-visible:border-violet" />
        </div>
        <div>
          <label htmlFor="salaryMax" className="block text-sm font-medium text-navy mb-1.5">Max salary (LPA)</label>
          <input id="salaryMax" type="number" min="0" value={form.salaryMax} onChange={update("salaryMax")} placeholder="14" className="w-full text-sm rounded-lg border border-border px-3.5 py-2.5 outline-none focus-visible:border-violet" />
        </div>
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-navy mb-1.5">Required skills</label>
        <input id="skills" value={form.skills} onChange={update("skills")} placeholder="React, TypeScript, REST APIs (comma separated)" className="w-full text-sm rounded-lg border border-border px-3.5 py-2.5 outline-none focus-visible:border-violet" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-navy mb-1.5">Job description</label>
        <textarea id="description" required rows={5} value={form.description} onChange={update("description")} placeholder="What will this person own? What does success look like in 90 days?" className="w-full text-sm rounded-lg border border-border px-3.5 py-2.5 outline-none focus-visible:border-violet resize-none" />
        {fieldErrors.description && <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>}
      </div>

      <button type="submit" disabled={submitting} className="w-full bg-gold text-navy font-semibold text-sm rounded-xl py-3 hover:brightness-105 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? "Publishing…" : "Publish job"}
      </button>
    </form>
  );
}
