import { Link } from "react-router-dom";
import { Briefcase, Linkedin, Twitter, Instagram } from "lucide-react";
import { ROUTES } from "../routes/routerpath.jsx";

export default function Footer() {
  const columns = [
    {
      title: "For job seekers",
      links: [
        { name: "Browse jobs", path: "/#jobs" },
        { name: "Career advice", path: "/#jobs" },
        { name: "Resume builder", path: ROUTES.RESUME_BUILDER },
        { name: "Salary guide", path: ROUTES.SALARY_GUIDE },
      ],
    },
    {
      title: "For employers",
      links: [
        { name: "Post a job", path: ROUTES.POST_JOB },
        { name: "Search resumes", path: ROUTES.EMPLOYER_SEARCH_RESUMES },
        { name: "Pricing", path: ROUTES.PRICING },
        { name: "Employer branding", path: "/#jobs" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About us", path: "/#jobs" },
        { name: "Newsroom", path: ROUTES.NEWSROOM },
        { name: "We're hiring", path: "/#jobs" },
        { name: "Contact", path: "/#jobs" },
      ],
    },
  ];

  return (
    <>
      <section className="bg-gold">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy">
              Ready to find what's next?
            </h2>
            <p className="text-navy/70 text-sm mt-1">Create a profile once, get matched everywhere.</p>
          </div>
          <Link
            to={ROUTES.CANDIDATE_REGISTER}
            className="shrink-0 bg-navy text-white font-semibold text-sm rounded-xl px-6 py-3.5 hover:bg-navy-soft transition-colors"
          >
            Create free profile
          </Link>
        </div>
      </section>

      <footer className="bg-navy text-white/70">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
              <span className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy">
                <Briefcase size={18} strokeWidth={2.5} />
              </span>
              CareerHub
            </div>
            <p className="text-sm mt-3 max-w-xs leading-relaxed">
              Connecting India's talent with 62,000+ companies hiring right now.
            </p>
            <div className="flex gap-3 mt-5">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#top"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold text-sm mb-4">{col.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.name}>
                    {l.path.startsWith("/") && !l.path.includes("#") ? (
                      <Link to={l.path} className="hover:text-white transition-colors">{l.name}</Link>
                    ) : (
                      <a href={l.path} className="hover:text-white transition-colors">{l.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs">
            <p>© {new Date().getFullYear()} CareerHub India. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#top" className="hover:text-white">Privacy</a>
              <a href="#top" className="hover:text-white">Terms</a>
              <a href="#top" className="hover:text-white">Sitemap</a>
              <Link to={ROUTES.ADMIN_LOGIN} className="hover:text-white">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
