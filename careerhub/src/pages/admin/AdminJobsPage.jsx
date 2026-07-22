import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import JobsTable from "../../components/admin/JobsTable.jsx";
import { adminApi } from "../../api/adminApi.js";
import { adminJobs as mockJobs } from "../../data/mockAdminData.js";

export default function AdminJobsPage() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState(mockJobs);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .jobs()
      .then((data) => {
        if (cancelled) return;
        setJobs(
          data.jobs.map((j) => ({
            id: j._id,
            title: j.title,
            company: j.company,
            status: j.status,
            applicants: j.applicantCount ?? 0,
            posted: new Date(j.createdAt).toLocaleDateString("en-IN"),
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
    if (!q) return jobs;
    return jobs.filter((j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
  }, [query, jobs]);

  return (
    <>
      <Helmet>
        <title>Manage Jobs — CareerHub Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminLayout title="Jobs" subtitle={`${jobs.length} total postings`}>
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
            placeholder="Search by title or company"
            className="w-full text-sm rounded-lg border border-border pl-9 pr-3 py-2.5 outline-none focus-visible:border-violet bg-white"
          />
        </div>
        <JobsTable jobs={filtered} />
      </AdminLayout>
    </>
  );
}
