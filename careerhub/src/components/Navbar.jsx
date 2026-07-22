import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { ROUTES } from "../routes/routerpath.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Find Jobs", "Companies", "Salary Guide", "Career Advice"];

  const goPostJob = () => navigate(user?.role === "employer" ? ROUTES.POST_JOB : ROUTES.EMPLOYER_LOGIN);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrolled ? "shadow-card bg-navy/98" : "bg-navy"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <a href="#top" className="flex items-center gap-2 text-white font-display font-bold text-lg tracking-tight">
          <span className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy">
            <Briefcase size={18} strokeWidth={2.5} />
          </span>
          CareerHub
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          {links.map((l) => (
            <li key={l}>
              <a href="#jobs" className="hover:text-white transition-colors">{l}</a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-white/70">Hi, {user.name || user.email.split("@")[0]}</span>
              <button
                onClick={logout}
                className="text-sm font-semibold text-white/90 hover:text-white px-3 py-2 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to={ROUTES.CANDIDATE_LOGIN}
              className="text-sm font-semibold text-white/90 hover:text-white px-3 py-2 transition-colors"
            >
              Log in
            </Link>
          )}
          <button
            onClick={goPostJob}
            className="text-sm font-semibold bg-gold text-navy px-4 py-2 rounded-lg hover:brightness-105 active:scale-[0.98] transition"
          >
            Post a job
          </button>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-navy-soft border-t border-white/10 px-5 py-4 space-y-4">
          {links.map((l) => (
            <a key={l} href="#jobs" className="block text-white/90 font-medium text-sm">
              {l}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <button onClick={logout} className="flex-1 text-sm font-semibold text-white border border-white/25 rounded-lg py-2">
                Log out
              </button>
            ) : (
              <Link to={ROUTES.CANDIDATE_LOGIN} className="flex-1 text-sm font-semibold text-white border border-white/25 rounded-lg py-2 text-center">
                Log in
              </Link>
            )}
            <button onClick={goPostJob} className="flex-1 text-sm font-semibold bg-gold text-navy rounded-lg py-2">
              Post a job
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
