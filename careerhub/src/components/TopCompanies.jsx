import { companies } from "../data/mockData";

export default function TopCompanies() {
  const loop = [...companies, ...companies];

  return (
    <section className="py-14 bg-surface border-y border-border overflow-hidden">
      <p className="text-center text-xs font-semibold tracking-wide uppercase text-text-muted mb-6">
        Hiring actively this week
      </p>
      <div className="relative">
        <div className="flex gap-10 w-max animate-marquee motion-reduce:animate-none">
          {loop.map((c, i) => (
            <div key={`${c.name}-${i}`} className="flex items-center gap-3 shrink-0 px-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm"
                style={{ backgroundColor: c.color }}
                aria-hidden="true"
              >
                {c.initial}
              </div>
              <div>
                <p className="font-semibold text-sm text-navy leading-tight">{c.name}</p>
                <p className="text-xs text-text-muted font-mono-num">{c.openings} openings</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent" />
      </div>
    </section>
  );
}
