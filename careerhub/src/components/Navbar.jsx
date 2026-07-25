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

  const getLinks = () => {
    const base = [
      { name: "Find Jobs", path: "/#jobs" },
      { name: "Companies", path: "/#jobs" },
    ];
    if (user?.role === "candidate") {
      return [
        ...base,
        { name: "Build Resume", path: ROUTES.RESUME_BUILDER },
        { name: "Mock Interview", path: ROUTES.MOCK_INTERVIEW },
        { name: "Dashboard", path: ROUTES.CANDIDATE_DASHBOARD },
      ];
    }
    if (user?.role === "employer") {
      return [
        ...base,
        { name: "Search Resumes", path: ROUTES.EMPLOYER_SEARCH_RESUMES },
        { name: "Post a Job", path: ROUTES.POST_JOB },
      ];
    }
    return [
      ...base,
      { name: "Salary Guide", path: ROUTES.SALARY_GUIDE },
      { name: "Career Advice", path: "/#jobs" },
    ];
  };

  const displayLinks = getLinks();
  const goPostJob = () => navigate(user?.role === "employer" ? ROUTES.POST_JOB : ROUTES.EMPLOYER_LOGIN);

  const getNavButton = (isMobile = false) => {
    const baseClasses = isMobile
      ? "flex-1 text-sm font-semibold bg-gold text-navy rounded-lg py-2 text-center"
      : "text-sm font-semibold bg-gold text-navy px-4 py-2 rounded-lg hover:brightness-105 active:scale-[0.98] transition";

    if (user?.role === "candidate") {
      return (
        <Link to={ROUTES.CANDIDATE_DASHBOARD} className={baseClasses} onClick={() => isMobile && setOpen(false)}>
          Dashboard
        </Link>
      );
    }

    return (
      <button onClick={() => { goPostJob(); isMobile && setOpen(false); }} className={baseClasses}>
        Post a job
      </button>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrolled ? "shadow-card bg-navy/98" : "bg-navy"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 text-white font-display font-bold text-lg tracking-tight">
          <span className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy">
            <Briefcase size={18} strokeWidth={2.5} />
          </span>
          CareerHub
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          {displayLinks.map((l) => (
            <li key={l.name}>
              {l.path.startsWith("/") && !l.path.includes("#") ? (
                <Link to={l.path} className="hover:text-white transition-colors">{l.name}</Link>
              ) : (
                <a href={l.path} className="hover:text-white transition-colors">{l.name}</a>
              )}
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
          {getNavButton()}
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
          {displayLinks.map((l) => (
            l.path.startsWith("/") && !l.path.includes("#") ? (
              <Link key={l.name} to={l.path} className="block text-white/90 font-medium text-sm" onClick={() => setOpen(false)}>
                {l.name}
              </Link>
            ) : (
              <a key={l.name} href={l.path} className="block text-white/90 font-medium text-sm" onClick={() => setOpen(false)}>
                {l.name}
              </a>
            )
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <button onClick={() => { logout(); setOpen(false); }} className="flex-1 text-sm font-semibold text-white border border-white/25 rounded-lg py-2">
                Log out
              </button>
            ) : (
              <Link to={ROUTES.CANDIDATE_LOGIN} className="flex-1 text-sm font-semibold text-white border border-white/25 rounded-lg py-2 text-center" onClick={() => setOpen(false)}>
                Log in
              </Link>
            )}
            {getNavButton(true)}
          </div>
        </div>
      )}
    </header>
  );
}

