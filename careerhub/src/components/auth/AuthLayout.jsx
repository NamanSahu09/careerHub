import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { ROUTES } from "../../routes/routerpath.jsx";

/**
 * Split-screen shell used by every login/register page: brand panel on the
 * left (desktop), form content passed as children on the right.
 */
export default function AuthLayout({ eyebrow, title, subtitle, panelColor = "var(--color-navy)", children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg">
      <div
        className="hidden lg:flex flex-col justify-between p-10 text-white"
        style={{ background: panelColor }}
      >
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy">
            <Briefcase size={18} strokeWidth={2.5} />
          </span>
          CareerHub
        </Link>
        <div>
          <p className="text-sm uppercase tracking-wide text-gold font-semibold mb-3">{eyebrow}</p>
          <h1 className="font-display font-bold text-3xl leading-snug max-w-sm">{title}</h1>
          <p className="text-white/60 text-sm mt-3 max-w-sm">{subtitle}</p>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} CareerHub India</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link to={ROUTES.HOME} className="lg:hidden flex items-center gap-2 font-display font-bold text-lg text-navy mb-8">
            <span className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy">
              <Briefcase size={18} strokeWidth={2.5} />
            </span>
            CareerHub
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
