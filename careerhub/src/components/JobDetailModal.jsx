import { useEffect, useRef } from "react";
import { X, MapPin, Briefcase, Wallet, Users } from "lucide-react";
import { brandFor } from "../utils/brand.js";

export default function JobDetailModal({ job, onClose, onSave, saved }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!job) return null;
  const { color, logo } = brandFor(job);

  return (
    <div
      className="fixed inset-0 z-[60] bg-navy/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 relative animate-fadeUp"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close job details"
          className="absolute top-5 right-5 text-text-muted hover:text-navy"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4 pr-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-display font-bold text-xl shrink-0"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          >
            {logo}
          </div>
          <div>
            <h2 id="job-modal-title" className="font-display font-bold text-xl text-navy leading-snug">
              {job.title}
            </h2>
            <p className="text-text-muted text-sm mt-0.5">{job.company}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-text-muted"><MapPin size={15} /> {job.location} · {job.mode}</div>
          <div className="flex items-center gap-2 text-text-muted"><Briefcase size={15} /> {job.experience}</div>
          <div className="flex items-center gap-2 text-text-muted"><Wallet size={15} /> {job.salary}</div>
          <div className="flex items-center gap-2 text-text-muted"><Users size={15} /> {job.applicants} applicants</div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-navy text-sm mb-2">About the role</h3>
          <p className="text-sm text-text-muted leading-relaxed">{job.description}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-navy text-sm mb-2">Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span key={s} className="text-xs font-medium bg-bg text-text-muted border border-border rounded-md px-2.5 py-1">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button className="flex-1 bg-gold text-navy font-semibold text-sm rounded-xl py-3 hover:brightness-105 active:scale-[0.98] transition">
            Apply now
          </button>
          <button
            onClick={() => onSave(job.id)}
            className={`flex-1 font-semibold text-sm rounded-xl py-3 border transition-colors ${
              saved ? "bg-violet/10 border-violet text-violet" : "border-border text-navy hover:border-violet hover:text-violet"
            }`}
          >
            {saved ? "Saved to profile" : "Save for later"}
          </button>
        </div>
      </div>
    </div>
  );
}
