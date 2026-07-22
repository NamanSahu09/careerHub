import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import JobsTable from "../../components/admin/JobsTable.jsx";
import { adminApi } from "../../api/adminApi.js";
import { adminStats as mockStats, adminJobs as mockJobs } from "../../data/mockAdminData.js";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState(mockJobs);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([adminApi.stats(), adminApi.jobs()])
      .then(([statsData, jobsData]) => {
        if (cancelled) return;
        setStats([
          { label: "Live jobs", value: statsData.stats.liveJobs.toLocaleString("en-IN") },
          { label: "Candidates", value: statsData.stats.candidates.toLocaleString("en-IN") },
          { label: "Employers", value: statsData.stats.employers.toLocaleString("en-IN") },
          { label: "Applications", value: statsData.stats.applications.toLocaleString("en-IN") },
        ]);
        setJobs(
          jobsData.jobs.map((j) => ({
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

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — CareerHub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminLayout title="Dashboard" subtitle="Platform overview">
        {offline && (
          <p className="text-xs text-text-muted bg-gold/10 rounded-lg px-3 py-2 mb-4">
            Showing sample data — couldn't reach the API.
          </p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {(stats || mockStats).map((s) => <StatCard key={s.label} {...s} />)}
        </div>
        <h2 className="font-display font-bold text-lg text-navy mb-3">Recent job postings</h2>
        <JobsTable jobs={jobs} />
      </AdminLayout>
    </>
  );
}
