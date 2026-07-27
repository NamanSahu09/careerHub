import { useState, useEffect, useRef } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { jobRoles } from "../data/mockData";

/**
 * Typewriter effect cycling through real job roles inside the search input's
 * placeholder — makes the hero feel alive without motion competing with content.
 */
function useTypewriter(words, { typeSpeed = 55, deleteSpeed = 30, pause = 1400 } = {}) {
  const [text, setText] = useState("");
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    let timeout;
    const tick = () => {
      const current = words[indexRef.current % words.length];
      if (!deletingRef.current) {
        charRef.current += 1;
        setText(current.slice(0, charRef.current));
        if (charRef.current === current.length) {
          deletingRef.current = true;
          timeout = setTimeout(tick, pause);
          return;
        }
        timeout = setTimeout(tick, typeSpeed);
      } else {
        charRef.current -= 1;
        setText(current.slice(0, charRef.current));
        if (charRef.current === 0) {
          deletingRef.current = false;
          indexRef.current += 1;
        }
        timeout = setTimeout(tick, deleteSpeed);
      }
    };
    timeout = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timeout);
  }, [words, typeSpeed, deleteSpeed, pause]);

  return text;
}

export default function Hero({ onSearch }) {
  const placeholder = useTypewriter(jobRoles);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ query, location });
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" className="bg-navy relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-gold bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          1.4L+ openings live right now
        </span>

        <h1 className="mt-6 font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight">
          Your next role is
          <br className="hidden sm:block" /> already hiring.
        </h1>
        <p className="mt-5 text-white/65 text-base sm:text-lg max-w-xl mx-auto">
          Search openings from 62,000+ companies across India, filter by what
          actually matters, and apply without the busywork.
        </p>

        <form
          onSubmit={submit}
          className="mt-9 bg-white rounded-2xl shadow-card-hover p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto text-left"
        >
          <label className="flex-1 flex items-center gap-2 px-3 py-2.5">
            <Search size={18} className="text-text-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search “${placeholder}”`}
              aria-label="Search job title, skill, or company"
              className="w-full outline-none text-sm text-text placeholder:text-text-muted"
            />
          </label>
          <div className="hidden sm:block w-px bg-border my-1" />
          <label className="flex items-center gap-2 px-3 py-2.5 sm:w-44">
            <MapPin size={18} className="text-text-muted shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City"
              aria-label="Location"
              className="w-full outline-none text-sm text-text placeholder:text-text-muted"
            />
          </label>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 bg-gold text-navy font-semibold text-sm rounded-xl px-5 py-3 hover:brightness-105 active:scale-[0.98] transition"
          >
            Search jobs <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-white/50">
          <span>Trending:</span>
          {["React Developer", "Data Analyst", "Remote", "Product Manager"].map((t) => (
            <button
              key={t}
              onClick={() => setQuery(t)}
              className="hover:text-gold transition-colors underline underline-offset-2 decoration-white/20"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
