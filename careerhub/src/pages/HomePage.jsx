import { useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import TrustBar from "../components/TrustBar.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import JobList from "../components/JobList.jsx";
import TopCompanies from "../components/TopCompanies.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Footer from "../components/Footer.jsx";
import JobDetailModal from "../components/JobDetailModal.jsx";
import { jobs as mockJobs } from "../data/mockData.js";
import { jobsApi } from "../api/jobsApi.js";

/** Turns a createdAt timestamp into "2 days ago" style text for JobCard. */
function relativeTime(dateStr) {
  if (!dateStr) return "Recently";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function HomePage() {
  const [filters, setFilters] = useState({ query: "", location: "" });
  const [activeJob, setActiveJob] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [jobs, setJobs] = useState(mockJobs);
  const [offline, setOffline] = useState(false);

  // Try the real API first; if it's unreachable (e.g. backend not running
  // yet), fall back to local sample data so the UI is never empty.
  useEffect(() => {
    let cancelled = false;
    jobsApi
      .list()
      .then((data) => {
        if (!cancelled && data.jobs?.length) {
          setJobs(data.jobs.map((j) => ({ ...j, id: j._id, posted: relativeTime(j.createdAt), applicants: j.applicantCount ?? 0 })));
        }
      })
      .catch(() => {
        if (!cancelled) setOffline(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = useCallback((f) => setFilters(f), []);
  const handleCategory = useCallback((name) => setFilters({ query: name, location: "" }), []);
  const toggleSave = useCallback(
    (id) => setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    []
  );

  return (
    <>
      <Helmet>
        <title>CareerHub India — Find Your Next Job Faster</title>
        <meta
          name="description"
          content="Search 1.4 lakh+ live job openings across IT, sales, marketing, finance and design from 62,000+ companies hiring in India."
        />
      </Helmet>

      <Navbar />
      <main>
        <Hero onSearch={handleSearch} />
        <TrustBar />
        {offline && (
          <p className="text-center text-xs text-text-muted bg-gold/10 py-2">
            Showing sample listings — couldn't reach the API, so these aren't live data.
          </p>
        )}
        <CategoryGrid onSelect={handleCategory} />
        <JobList
          jobs={jobs}
          filters={filters}
          savedIds={savedIds}
          onOpen={setActiveJob}
          onSave={toggleSave}
        />
        <TopCompanies />
        <Testimonials />
      </main>
      <Footer />

      {activeJob && (
        <JobDetailModal
          job={activeJob}
          onClose={() => setActiveJob(null)}
          onSave={toggleSave}
          saved={savedIds.includes(activeJob.id)}
        />
      )}
    </>
  );
}
