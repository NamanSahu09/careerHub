import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import CandidatesTable from "../../components/admin/CandidatesTable.jsx";
import { adminApi } from "../../api/adminApi.js";
import { adminCandidates as mockCandidates } from "../../data/mockAdminData.js";

export default function AdminCandidatesPage() {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState(mockCandidates);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .candidates()
      .then((data) => {
        if (cancelled) return;
        setCandidates(
          data.candidates.map((c) => ({
            id: c.id,
            name: c.name,
            role: "Candidate",
            location: "—",
            applications: 0,
            joined: new Date(c.createdAt).toLocaleDateString("en-IN"),
          }))
        );
      })
      .catch(() => !cancelled && setOffline(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
  }, [query, candidates]);

  return (
    <>
      <Helmet>
        <title>Manage Candidates — CareerHub Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminLayout title="Candidates" subtitle={`${candidates.length} registered profiles`}>
        {offline && (
          <p className="text-xs text-text-muted bg-gold/10 rounded-lg px-3 py-2 mb-4">
            Showing sample data — couldn't reach the API.
          </p>
        )}
        <div className="relative max-w-sm mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or role"
            className="w-full text-sm rounded-lg border border-border pl-9 pr-3 py-2.5 outline-none focus-visible:border-violet bg-white"
          />
        </div>
        <CandidatesTable candidates={filtered} />
      </AdminLayout>
    </>
  );
}
