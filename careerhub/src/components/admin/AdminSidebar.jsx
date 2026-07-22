import { NavLink } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROUTES } from "../../routes/routerpath.jsx";

const links = [
  { to: ROUTES.ADMIN_DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.ADMIN_JOBS, label: "Jobs", icon: Briefcase },
  { to: ROUTES.ADMIN_CANDIDATES, label: "Candidates", icon: Users },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 shrink-0 bg-navy text-white flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <span className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy">
          <ShieldCheck size={18} strokeWidth={2.5} />
        </span>
        <span className="font-display font-bold">Admin portal</span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 text-sm font-medium rounded-lg px-3 py-2.5 transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <p className="px-3 text-xs text-white/40 truncate mb-2">{user?.email}</p>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 text-sm font-medium rounded-lg px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={17} /> Log out
        </button>
      </div>
    </aside>
  );
}
