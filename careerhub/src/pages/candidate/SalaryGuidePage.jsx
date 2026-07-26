import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Info, TrendingUp, DollarSign, Briefcase } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

const SALARY_DATA = [
  {
    title: "Software Engineer",
    category: "IT & Software",
    entry: "₹6 - ₹12 LPA",
    mid: "₹12 - ₹22 LPA",
    senior: "₹22 - ₹45 LPA",
    growth: "+14% YoY",
    demand: "Very High",
    skills: ["React", "Node.js", "System Design", "Algorithms"],
  },
  {
    title: "Data Scientist",
    category: "Data & Analytics",
    entry: "₹8 - ₹14 LPA",
    mid: "₹14 - ₹25 LPA",
    senior: "₹25 - ₹50 LPA",
    growth: "+18% YoY",
    demand: "High",
    skills: ["Python", "Machine Learning", "SQL", "Pandas"],
  },
  {
    title: "Product Manager",
    category: "Management",
    entry: "₹10 - ₹15 LPA",
    mid: "₹15 - ₹28 LPA",
    senior: "₹28 - ₹55 LPA",
    growth: "+12% YoY",
    demand: "Very High",
    skills: ["Product Strategy", "Roadmapping", "A/B Testing", "Agile"],
  },
  {
    title: "UI/UX Designer",
    category: "Design",
    entry: "₹4 - ₹8 LPA",
    mid: "₹8 - ₹15 LPA",
    senior: "₹15 - ₹30 LPA",
    growth: "+10% YoY",
    demand: "High",
    skills: ["Figma", "Design Systems", "User Research", "Wireframing"],
  },
  {
    title: "DevOps Engineer",
    category: "IT & Software",
    entry: "₹6 - ₹10 LPA",
    mid: "₹10 - ₹18 LPA",
    senior: "₹18 - ₹35 LPA",
    growth: "+15% YoY",
    demand: "Very High",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD Pipelines"],
  },
  {
    title: "Digital Marketer",
    category: "Marketing",
    entry: "₹3 - ₹6 LPA",
    mid: "₹6 - ₹12 LPA",
    senior: "₹12 - ₹25 LPA",
    growth: "+8% YoY",
    demand: "Moderate",
    skills: ["SEO", "Google Ads", "Meta Ads", "Analytics"],
  },
  {
    title: "HR Manager",
    category: "HR & Admin",
    entry: "₹4 - ₹7 LPA",
    mid: "₹7 - ₹12 LPA",
    senior: "₹12 - ₹22 LPA",
    growth: "+6% YoY",
    demand: "Moderate",
    skills: ["Talent Acquisition", "Employee Relations", "HRIS", "Compliance"],
  },
  {
    title: "Finance Analyst",
    category: "Finance",
    entry: "₹5 - ₹9 LPA",
    mid: "₹9 - ₹16 LPA",
    senior: "₹16 - ₹30 LPA",
    growth: "+9% YoY",
    demand: "High",
    skills: ["Financial Modeling", "Excel", "Valuation", "Forecasting"],
  },
];

export default function SalaryGuidePage() {
  const [query, setQuery] = useState("");

  const filteredData = SALARY_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>India Tech & Business Salary Guide — CareerHub</title>
        <meta
          name="description"
          content="Find out how much you should be earning. Compare entry-level, mid-level, and senior salaries for popular roles in India."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#F5F7FA] py-12 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet bg-violet/10 rounded-full px-3.5 py-1.5">
              Market Intelligence
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-navy mt-3">
              Know Your Worth
            </h1>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              Browse average salaries in India based on current hiring rates, job postings, and candidate reports.
            </p>

            {/* Search Input */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-border p-2.5 flex items-center gap-2.5 max-w-md mx-auto">
              <Search size={18} className="text-text-muted shrink-0 ml-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title or domain (e.g. Designer)..."
                className="w-full text-sm outline-none text-text placeholder:text-text-muted"
              />
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredData.map((item) => (
              <section
                key={item.title}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition-all"
              >
                {/* Card Title Header */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h2 className="font-display font-bold text-xl text-navy mt-0.5">
                      {item.title}
                    </h2>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                      <TrendingUp size={11} /> {item.growth}
                    </span>
                    <p className="text-[10px] text-text-muted mt-1">Demand: <strong className="text-navy">{item.demand}</strong></p>
                  </div>
                </div>

                {/* Salary Ranges Tiers */}
                <div className="space-y-3 bg-bg/50 p-4 rounded-xl border border-border mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted font-medium">Entry-Level (1-3 yrs)</span>
                    <span className="font-bold text-navy font-mono-num">{item.entry}</span>
                  </div>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full" style={{ width: "30%" }}></div>
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-text-muted font-medium">Mid-Level (4-7 yrs)</span>
                    <span className="font-bold text-navy font-mono-num">{item.mid}</span>
                  </div>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-violet h-full rounded-full" style={{ width: "60%" }}></div>
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-text-muted font-medium">Senior (8+ yrs)</span>
                    <span className="font-bold text-navy font-mono-num">{item.senior}</span>
                  </div>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal h-full rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Highly Valued Skills
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-medium bg-bg text-text border border-border rounded-md px-2 py-0.5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ))}

            {filteredData.length === 0 && (
              <div className="sm:col-span-2 text-center py-12 border border-dashed border-border bg-white rounded-2xl">
                <p className="text-sm text-text-muted">No salary data matches your query.</p>
              </div>
            )}
          </div>

          <div className="bg-navy rounded-2xl p-6 sm:p-8 text-white mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <Info size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Are you currently looking for a job?</h3>
                <p className="text-white/60 text-sm mt-1 max-w-xl">
                  Build your resume and search verified jobs in India with clear salary bands listed upfront.
                </p>
              </div>
            </div>
            <a
              href="#jobs"
              className="bg-gold text-navy font-semibold text-sm rounded-xl px-5 py-3 hover:brightness-105 active:scale-[0.98] transition shrink-0"
            >
              Browse Openings
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
