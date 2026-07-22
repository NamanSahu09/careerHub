import AdminSidebar from "./AdminSidebar.jsx";

export default function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="flex bg-bg min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 flex items-center px-6 sm:px-8 bg-white border-b border-border">
          <div>
            <h1 className="font-display font-bold text-lg text-navy">{title}</h1>
            {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
          </div>
        </header>
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
