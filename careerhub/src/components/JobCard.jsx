import { MapPin, Briefcase, Wallet, Clock, Zap } from "lucide-react";
import { brandFor } from "../utils/brand.js";

export default function JobCard({ job, onOpen, onSave, saved }) {
  const { color, logo } = brandFor(job);
  return (
    <article className="bg-surface border border-border rounded-xl p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all animate-fadeUp">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-11 h-11 rounded-lg border border-border bg-white object-contain shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/44?text=" + (job.company?.charAt(0) || "J");
              }}
            />
          ) : (
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-display font-bold shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            >
              {logo}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-navy text-[15px] leading-snug truncate">
              <button onClick={() => onOpen(job)} className="hover:underline text-left">
                {job.title}
              </button>
            </h3>
            <p className="text-sm text-text-muted truncate">
              {job.company}
              {job.isExternal && (
                <span className="ml-1.5 inline-flex items-center text-[10px] font-semibold bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC] px-1.5 py-0.5 rounded">
                  LinkedIn
                </span>
              )}
            </p>
          </div>
        </div>
        {job.urgent && (
          <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-teal px-2 py-1 rounded-full">
            <Zap size={11} /> Urgent
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1"><MapPin size={13} /> {job.location} · {job.mode}</span>
        <span className="inline-flex items-center gap-1"><Briefcase size={13} /> {job.experience}</span>
        <span className="inline-flex items-center gap-1"><Wallet size={13} /> {job.salary}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.map((s) => (
          <span key={s} className="text-[11px] font-medium bg-bg text-text-muted border border-border rounded-md px-2 py-1">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <Clock size={12} /> {job.posted} · {job.applicants} applied
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave(job.id)}
            aria-pressed={saved}
            className={`text-xs font-semibold rounded-lg px-3 py-1.5 border transition-colors ${
              saved
                ? "bg-violet/10 border-violet text-violet"
                : "border-border text-text-muted hover:border-violet hover:text-violet"
            }`}
          >
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={() => onOpen(job)}
            className="text-xs font-semibold bg-navy text-white rounded-lg px-3 py-1.5 hover:bg-navy-soft transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
