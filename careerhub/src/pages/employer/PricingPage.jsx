import { Helmet } from "react-helmet-async";
import { Check, Info, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { ROUTES } from "../../routes/routerpath.jsx";

const PLANS = [
  {
    name: "Starter",
    price: "₹0",
    period: "forever",
    description: "Great for testing the waters and small teams.",
    features: [
      "Up to 3 active job listings",
      "Standard candidate search",
      "Basic applicant review dashboard",
      "Standard support (24-48 hrs)",
    ],
    cta: "Post a job free",
    link: ROUTES.POST_JOB,
    highlight: false,
  },
  {
    name: "Pro Growth",
    price: "₹2,499",
    period: "month",
    description: "Best for growing companies hiring actively.",
    features: [
      "Unlimited active job listings",
      "Featured job postings (Urgent badge)",
      "Access to Search Talent Resumes portal",
      "AI candidate screening matching recommendation",
      "Priority email support (under 4 hrs)",
    ],
    cta: "Upgrade to Pro",
    link: ROUTES.POST_JOB,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annually",
    description: "For high-volume recruitment needs.",
    features: [
      "Custom ATS integrations (Workday, Greenhouse)",
      "Dedicated account manager",
      "Company branding & header customization",
      "Custom analytics & reporting dashboard",
      "24/7 Phone & Slack support",
    ],
    cta: "Contact Sales",
    link: ROUTES.HOME,
    highlight: false,
  },
];

const FAQS = [
  {
    q: "How long does a job posting stay live?",
    a: "Standard job postings stay live for 30 days. You can renew or close them at any time from your employer dashboard.",
  },
  {
    q: "What is included in the Resumes Search access?",
    a: "Under the Pro and Enterprise plans, you can query our database of candidates, filter by technical skills or experience, and view complete candidate profiles and resumes.",
  },
  {
    q: "Can I cancel my Pro subscription at any time?",
    a: "Yes! There are no lock-in contracts. You can downgrade or cancel your subscription anytime, and you will retain Pro benefits until the end of your billing cycle.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Pricing Plans for Recruiters & Employers — CareerHub</title>
        <meta
          name="description"
          content="Find the recruitment plan that matches your company's growth. Post jobs free, search resumes, and get matched to candidates."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#F5F7FA] py-12 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet bg-violet/10 rounded-full px-3.5 py-1.5">
              Hiring Solutions
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-navy mt-3">
              Recruit the Best Talent
            </h1>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              Whether you are a small startup or a large enterprise, we have a plan configured to help you hire.
            </p>
          </header>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-8 items-start mb-16">
            {PLANS.map((plan) => (
              <section
                key={plan.name}
                className={`bg-white rounded-2xl border p-8 shadow-sm flex flex-col justify-between min-h-[480px] relative ${
                  plan.highlight
                    ? "border-violet ring-2 ring-violet/20 -translate-y-2 md:-translate-y-4"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet text-white font-semibold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <h2 className="font-display font-bold text-xl text-navy">{plan.name}</h2>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{plan.description}</p>

                  <div className="my-6">
                    <span className="font-display font-bold text-4xl text-navy font-mono-num">{plan.price}</span>
                    <span className="text-xs text-text-muted font-medium ml-1">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-3.5 text-xs text-[#16213A] border-t border-border pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-4 h-4 rounded bg-teal/10 text-teal flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    to={plan.link}
                    className={`w-full py-3 rounded-xl text-sm font-semibold text-center block transition shadow-sm ${
                      plan.highlight
                        ? "bg-violet text-white hover:brightness-110"
                        : "bg-navy text-white hover:bg-navy-soft"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </section>
            ))}
          </div>

          {/* FAQs */}
          <section className="max-w-3xl mx-auto border-t border-border pt-16">
            <h2 className="font-display font-bold text-2xl text-navy text-center mb-8 flex items-center justify-center gap-2">
              <HelpCircle className="text-violet" size={24} /> Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                  <h3 className="font-semibold text-sm text-navy mb-2">{faq.q}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
