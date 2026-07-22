import { stats } from "../data/mockData";

export default function TrustBar() {
  return (
    <section className="bg-navy-soft border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              {i === 0 && (
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
                </span>
              )}
              <p className="font-mono-num text-xl sm:text-2xl font-semibold text-white">{s.value}</p>
            </div>
            <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
