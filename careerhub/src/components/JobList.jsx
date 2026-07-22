import { useMemo, useState } from "react";
import { SlidersHorizontal, Inbox } from "lucide-react";
import JobCard from "./JobCard";

const MODES = ["Remote", "Hybrid", "On-site"];
const EXPERIENCE = ["1-3 yrs", "2-5 yrs", "3-6 yrs", "4-7 yrs"];

export default function JobList({ jobs, filters, savedIds, onOpen, onSave }) {
  const [mode, setMode] = useState(null);
  const [experience, setExperience] = useState(null);
  const [sort, setSort] = useState("relevance");

  const filtered = useMemo(() => {
    let list = jobs.filter((j) => {
      const q = filters.query?.trim().toLowerCase();
      const loc = filters.location?.trim().toLowerCase();
      const matchesQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q));
      const matchesLoc = !loc || j.location.toLowerCase().includes(loc);
      const matchesMode = !mode || j.mode === mode;
      const matchesExp = !experience || j.experience === experience;
      return matchesQuery && matchesLoc && matchesMode && matchesExp;
    });

    if (sort === "applicants") list = [...list].sort((a, b) => a.applicants - b.applicants);
    if (sort === "urgent") list = [...list].sort((a, b) => Number(b.urgent) - Number(a.urgent));
    return list;
  }, [jobs, filters, mode, experience, sort]);

  const Chip = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
        active
          ? "bg-navy text-white border-navy"
          : "border-border text-text-muted hover:border-navy hover:text-navy"
      }`}
    >
      {children}
    </button>
  );

  return (
    <section id="jobs" className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy">
            {filtered.length} openings match your search
          </h2>
          <p className="text-text-muted text-sm mt-1">Updated in real time from our hiring partners.</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <SlidersHorizontal size={15} className="text-text-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-border rounded-lg px-2.5 py-1.5 text-sm text-navy bg-surface outline-none focus-visible:border-violet"
          >
            <option value="relevance">Most relevant</option>
            <option value="urgent">Urgent hiring first</option>
            <option value="applicants">Fewest applicants</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {MODES.map((m) => (
          <Chip key={m} active={mode === m} onClick={() => setMode(mode === m ? null : m)}>
            {m}
          </Chip>
        ))}
        <span className="w-px bg-border mx-1" />
        {EXPERIENCE.map((e) => (
          <Chip key={e} active={experience === e} onClick={() => setExperience(experience === e ? null : e)}>
            {e}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Inbox className="mx-auto text-text-muted" size={32} />
          <p className="mt-3 font-semibold text-navy">No openings match those filters</p>
          <p className="text-sm text-text-muted mt-1">Try clearing a filter or searching a broader role.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpen={onOpen}
              onSave={onSave}
              saved={savedIds.includes(job.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
