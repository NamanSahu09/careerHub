import { Helmet } from "react-helmet-async";
import { Newspaper, Calendar, ArrowRight, Share2, Award } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const ARTICLES = [
  {
    id: 1,
    title: "CareerHub Surpasses 1.4 Lakh Live Job Openings Across India",
    category: "Milestone",
    date: "July 24, 2026",
    summary: "Today we reached a record milestone with 1.4 lakh verified vacancies from 62,000 corporate hiring partners, helping freshers get jobs faster.",
    readTime: "3 min read",
  },
  {
    id: 2,
    title: "Introducing CareerBot: Your Dynamic AI-Powered Career Advisor",
    category: "Product Update",
    date: "June 18, 2026",
    summary: "We have rolled out our new streaming chat assistant, CareerBot, to help candidates optimize resumes, prep for interviews, and query skills live.",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "CareerHub Secures $4M Seed Funding to Expand Fresher Hiring Ecosystem",
    category: "Funding",
    date: "May 10, 2026",
    summary: "CareerHub raises $4M seed capital led by top Indian VCs to build relational applicant matching databases, automated resumes, and ATS connectors.",
    readTime: "5 min read",
  },
  {
    id: 4,
    title: "Top 10 In-Demand Tech Skills Companies are Hiring for in India",
    category: "Industry Report",
    date: "April 02, 2026",
    summary: "Our latest recruitment statistics reveal that React, AWS, Python, and UI/UX Figma design skills saw a 45% surge in active hiring demand this quarter.",
    readTime: "6 min read",
  },
];

export default function NewsroomPage() {
  return (
    <>
      <Helmet>
        <title>Newsroom & Press Releases — CareerHub</title>
        <meta
          name="description"
          content="Get the latest press releases, milestone updates, media assets, and product announcements from CareerHub India."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#F5F7FA] py-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-12 border-b border-border pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet bg-violet/10 rounded-full px-3.5 py-1.5">
                Press & Media
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-navy mt-3">
                CareerHub Newsroom
              </h1>
              <p className="text-text-muted text-sm mt-2 max-w-lg">
                Stay updated with corporate milestones, new feature announcements, and tech industry reports.
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-navy font-semibold border border-border bg-white rounded-xl px-4 py-2.5 transition">
              <Share2 size={14} /> Share Newsroom
            </button>
          </header>

          {/* Featured Article Banner */}
          <section className="bg-navy rounded-2xl text-white p-6 sm:p-10 mb-12 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} aria-hidden="true"></div>
            <div className="relative max-w-2xl">
              <span className="inline-block bg-gold text-navy text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4">
                Featured Announcement
              </span>
              <h2 className="font-display font-bold text-xl sm:text-3xl leading-snug">
                CareerHub Surpasses 1.4 Lakh Live Job Openings Across India
              </h2>
              <p className="text-white/60 text-xs sm:text-sm mt-3 leading-relaxed">
                Today we reached a record milestone with 1.4 lakh verified vacancies from 62,000 corporate hiring partners, helping freshers get jobs faster.
              </p>
              <div className="flex items-center gap-4 mt-6 text-xs text-white/50">
                <span className="flex items-center gap-1"><Calendar size={13} /> July 24, 2026</span>
                <span>·</span>
                <span>3 min read</span>
              </div>
            </div>
          </section>

          {/* Articles Grid */}
          <h2 className="font-display font-bold text-lg text-navy mb-6">Recent Press Releases</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {ARTICLES.slice(1).map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-violet bg-violet/10 rounded px-2.5 py-1">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                      <Calendar size={11} /> {article.date}
                    </span>
                  </div>
                  <h3 className="font-semibold text-navy text-[15px] leading-snug hover:text-violet transition">
                    {article.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
                  <span className="text-text-muted">{article.readTime}</span>
                  <button className="text-violet hover:text-navy font-bold flex items-center gap-0.5 hover:underline">
                    Read article <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
