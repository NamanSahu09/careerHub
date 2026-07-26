import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Mail, Phone, Briefcase, GraduationCap, X, FileText, Code, Award } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { resumeApi } from "../../api/resumeApi.js";

// Modal Component to display complete Resume Details
function ResumeDetailModal({ resume, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!resume) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-navy/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative animate-fadeUp border border-border"
      >
        <button
          onClick={onClose}
          aria-label="Close resume details"
          className="absolute top-5 right-5 text-text-muted hover:text-navy"
        >
          <X size={20} />
        </button>

        {/* Header Details */}
        <div className="text-center space-y-1.5 pb-6 border-b-2 border-navy">
          <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-2 text-2xl font-bold">
            {resume.personalDetails.fullName.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-display font-bold text-2xl text-navy">
            {resume.personalDetails.fullName}
          </h2>
          <p className="text-violet font-semibold text-sm">
            {resume.personalDetails.title || "Job Seeker"}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[#5B6B85] pt-1">
            <span className="flex items-center gap-1">
              <Mail size={13} /> {resume.personalDetails.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={13} /> {resume.personalDetails.phone}
            </span>
          </div>
        </div>

        {/* Summary */}
        {resume.personalDetails.summary && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
              Professional Summary
            </h3>
            <p className="text-xs leading-relaxed text-text mt-2 whitespace-pre-line">
              {resume.personalDetails.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
              Work Experience
            </h3>
            <div className="space-y-4 mt-3">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-semibold text-navy">
                    <span>{exp.position}</span>
                    <span>
                      {exp.startYear} - {exp.endYear || "Present"}
                    </span>
                  </div>
                  <div className="text-text-muted italic font-medium">{exp.company}</div>
                  {exp.description && (
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
              Education
            </h3>
            <div className="space-y-3 mt-3">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="text-xs flex justify-between">
                  <div>
                    <span className="font-semibold text-navy">{edu.degree}</span>
                    <span className="text-text-muted"> at {edu.school}</span>
                  </div>
                  <span className="shrink-0 text-text-muted">
                    {edu.startYear} - {edu.endYear}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
              Key Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-semibold text-navy bg-gold/10 border border-gold/30 rounded-lg px-2.5 py-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.projects?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
              Featured Projects
            </h3>
            <div className="space-y-4 mt-3">
              {resume.projects.map((proj, idx) => (
                <div key={idx} className="text-xs">
                  <h4 className="font-semibold text-navy">{proj.title}</h4>
                  {proj.technologies?.length > 0 && (
                    <div className="text-[#5B6B85] font-mono-num text-[10px] mt-0.5">
                      Tech Stack: {proj.technologies.join(", ")}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-[11px] text-[#16213A]/85 mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResumesPage() {
  const [query, setQuery] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeResume, setActiveResume] = useState(null);

  const fetchResumes = (searchVal = "") => {
    setLoading(true);
    resumeApi
      .searchResumes(searchVal)
      .then((data) => {
        setResumes(data.resumes || []);
      })
      .catch((err) => {
        console.error("Failed to query resumes:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResumes(query);
  };

  return (
    <>
      <Helmet>
        <title>Search Candidate Resumes — CareerHub</title>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#F5F7FA] py-12 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <header className="mb-8">
            <h1 className="font-display font-bold text-3xl text-navy">Search Talent Resumes</h1>
            <p className="text-text-muted text-sm mt-1">
              Query resumes of active candidates in CareerHub by title, role, bio, or skills.
            </p>
          </header>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-sm border border-border p-3 flex gap-2 mb-8 max-w-xl">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5">
              <Search size={18} className="text-text-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, title, or skills (e.g. React)..."
                className="w-full text-sm outline-none text-text placeholder:text-text-muted"
              />
            </div>
            <button
              type="submit"
              className="bg-gold text-navy font-semibold text-sm rounded-xl px-5 py-2.5 hover:brightness-105 active:scale-[0.98] transition shrink-0"
            >
              Search
            </button>
          </form>

          {/* Resumes Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm text-text-muted">Loading candidate database...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-white">
              <FileText className="mx-auto text-text-muted" size={32} />
              <p className="mt-3 font-semibold text-navy">No resumes matched your search</p>
              <p className="text-sm text-text-muted mt-1">Try querying a different skill or job title.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <article
                  key={resume._id}
                  className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-card transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-violet/10 text-violet flex items-center justify-center text-sm font-bold shrink-0">
                        {resume.personalDetails.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-navy text-[15px] truncate">
                          {resume.personalDetails.fullName}
                        </h3>
                        <p className="text-xs text-text-muted truncate">
                          {resume.personalDetails.title || "Job Seeker"}
                        </p>
                      </div>
                    </div>

                    {resume.personalDetails.summary && (
                      <p className="text-xs text-text-muted line-clamp-3 mb-4 leading-relaxed">
                        {resume.personalDetails.summary}
                      </p>
                    )}

                    {resume.skills?.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {resume.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-semibold text-navy bg-gold/10 border border-gold/20 rounded-md px-2 py-0.5"
                            >
                              {skill}
                            </span>
                          ))}
                          {resume.skills.length > 4 && (
                            <span className="text-[10px] text-text-muted font-medium px-1.5 py-0.5">
                              +{resume.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <button
                      onClick={() => setActiveResume(resume)}
                      className="text-xs font-semibold bg-navy text-white rounded-lg px-3.5 py-2 hover:bg-navy-soft transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {activeResume && (
        <ResumeDetailModal
          resume={activeResume}
          onClose={() => setActiveResume(null)}
        />
      )}
    </>
  );
}
