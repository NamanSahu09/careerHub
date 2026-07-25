import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, MapPin, Phone, Mail, Award, Briefcase, GraduationCap, ChevronRight, Sparkles, Mic } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { resumeApi } from "../../api/resumeApi.js";
import { ROUTES } from "../../routes/routerpath.jsx";

export default function CandidateDashboardPage() {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeApi
      .getResume()
      .then((data) => {
        if (data.resume && data.resume.personalDetails?.title) {
          setResume(data.resume);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch resume:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const hasResume = resume !== null;
  const skillsCount = resume?.skills?.length || 0;
  const experienceCount = resume?.experience?.length || 0;
  const educationCount = resume?.education?.length || 0;
  const projectsCount = resume?.projects?.length || 0;

  // Simple profile completion score calculation
  const completionScore = hasResume
    ? 30 + (skillsCount > 0 ? 20 : 0) + (experienceCount > 0 ? 20 : 0) + (educationCount > 0 ? 15 : 0) + (projectsCount > 0 ? 15 : 0)
    : 30; // base score for registering

  return (
    <>
      <Helmet>
        <title>Candidate Dashboard — CareerHub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#F5F7FA] py-12 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E3E8F0] shadow-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet bg-violet/10 rounded-full px-3 py-1">
                Candidate Account
              </span>
              <h1 className="font-display font-bold text-3xl text-navy mt-2">
                Welcome back, {user?.name || "User"}!
              </h1>
              <p className="text-[#5B6B85] text-sm mt-1">
                Manage your job application assets and track your match criteria.
              </p>
            </div>
            <Link
              to={ROUTES.RESUME_BUILDER}
              className="flex items-center gap-1.5 bg-gold text-navy font-semibold text-sm rounded-xl px-5 py-3 hover:brightness-105 active:scale-[0.98] transition shadow-sm"
            >
              <FileText size={16} />
              {hasResume ? "Update Resume" : "Build Resume"}
            </Link>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview Card */}
            <div className="lg:col-span-1 space-y-6">
              <section className="bg-white rounded-2xl border border-[#E3E8F0] p-6 shadow-sm">
                <h2 className="font-display font-bold text-lg text-navy mb-4 pb-2 border-b border-[#E3E8F0]">
                  Contact Information
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-[#16213A]">
                    <span className="w-8 h-8 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0">
                      <Mail size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-[#5B6B85] font-semibold uppercase tracking-wide">Email</p>
                      <p className="truncate font-medium">{user?.email}</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#16213A]">
                    <span className="w-8 h-8 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0">
                      <Phone size={16} />
                    </span>
                    <div>
                      <p className="text-xs text-[#5B6B85] font-semibold uppercase tracking-wide">Phone</p>
                      <p className="font-medium">{user?.phone || "N/A"}</p>
                    </div>
                  </li>
                </ul>
              </section>

              {/* Profile Strength Card */}
              <section className="bg-white rounded-2xl border border-[#E3E8F0] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-display font-bold text-lg text-navy">Profile Strength</h2>
                  <span className="text-sm font-bold text-teal">{completionScore}%</span>
                </div>
                <div className="w-full bg-[#E3E8F0] h-2.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-teal h-full transition-all duration-500"
                    style={{ width: `${completionScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[#5B6B85] leading-relaxed">
                  {completionScore === 100
                    ? "Fantastic! Your profile and resume are fully complete. Recruiters can find you easily."
                    : "Add education history, work experience, projects, and skills to increase your visibility to top recruiters."}
                </p>
              </section>

              {/* AI Interview Quick Action */}
              <section className="bg-navy rounded-2xl p-6 shadow-sm text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                    <Mic size={20} />
                  </div>
                  <h2 className="font-display font-bold text-lg">AI Mock Interview</h2>
                </div>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Practice with an AI interviewer. Get scored and receive a report card with feedback.
                </p>
                <Link
                  to={ROUTES.MOCK_INTERVIEW}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold/80 transition"
                >
                  Start Practice <ChevronRight size={14} />
                </Link>
              </section>
            </div>

            {/* Resume Overview Status */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <div className="bg-white rounded-2xl border border-[#E3E8F0] p-8 text-center shadow-sm">
                  <p className="text-sm text-[#5B6B85]">Checking your profile status...</p>
                </div>
              ) : hasResume ? (
                <section className="bg-white rounded-2xl border border-[#E3E8F0] p-6 sm:p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-navy">
                        {resume.personalDetails.title || "Untitled Resume"}
                      </h2>
                      <p className="text-[#5B6B85] text-sm mt-1">{resume.personalDetails.fullName}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-full">
                      <Sparkles size={11} /> Live Resume
                    </span>
                  </div>

                  {resume.personalDetails.summary && (
                    <div className="mb-6">
                      <p className="text-sm text-[#16213A] italic bg-bg/50 p-4 rounded-xl border border-[#E3E8F0]/80">
                        "{resume.personalDetails.summary}"
                      </p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6 mt-6">
                    <div className="bg-bg border border-border p-4 rounded-xl flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center">
                        <Briefcase size={20} />
                      </span>
                      <div>
                        <p className="text-xs text-[#5B6B85] font-semibold">Experience</p>
                        <p className="text-sm font-bold text-navy">{experienceCount} positions added</p>
                      </div>
                    </div>
                    <div className="bg-bg border border-border p-4 rounded-xl flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center">
                        <GraduationCap size={20} />
                      </span>
                      <div>
                        <p className="text-xs text-[#5B6B85] font-semibold">Education</p>
                        <p className="text-sm font-bold text-navy">{educationCount} institutions</p>
                      </div>
                    </div>
                  </div>

                  {skillsCount > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xs text-[#5B6B85] font-semibold uppercase tracking-wider mb-2.5">
                        Core Skills
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
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

                  <div className="mt-8 pt-6 border-t border-[#E3E8F0] flex justify-end">
                    <Link
                      to={ROUTES.RESUME_BUILDER}
                      className="text-sm font-semibold text-violet hover:text-violet/85 flex items-center gap-0.5 hover:underline"
                    >
                      Edit Resume Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </section>
              ) : (
                <section className="bg-white rounded-2xl border border-[#E3E8F0] p-8 text-center shadow-sm">
                  <div className="max-w-md mx-auto py-6">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                      <FileText size={32} />
                    </div>
                    <h2 className="font-display font-bold text-xl text-navy">No resume found</h2>
                    <p className="text-sm text-[#5B6B85] mt-2 mb-6">
                      Creating a resume profile is the fastest way to showcase your credentials to recruiters and get matched to jobs automatically.
                    </p>
                    <Link
                      to={ROUTES.RESUME_BUILDER}
                      className="bg-navy text-white font-semibold text-sm rounded-xl px-6 py-3 hover:bg-navy-soft transition shadow-sm inline-block"
                    >
                      Build Your Resume Now
                    </Link>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
