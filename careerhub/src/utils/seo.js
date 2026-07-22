/**
 * Builds schema.org JobPosting structured data for a single job.
 * Google Jobs and other job-search surfaces read this to show rich results.
 * Attach it as a <script type="application/ld+json"> on the job detail page.
 *
 * Note: for this to actually help SEO, the job detail page needs to be
 * server-rendered or pre-rendered (Next.js, or Vite SSR / react-snap) —
 * crawlers that don't execute JS won't see client-only JSON-LD.
 */
export function buildJobPostingSchema(job, baseUrl = "https://www.careerhub.example") {
  const [minLpa, maxLpaRaw] = job.salary.replace(/[₹\sLPA]/g, "").split("-");
  const maxLpa = maxLpaRaw || minLpa;

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: String(job.id),
    },
    datePosted: new Date().toISOString().slice(0, 10),
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: baseUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: Number(minLpa) * 100000,
        maxValue: Number(maxLpa) * 100000,
        unitText: "YEAR",
      },
    },
    url: `${baseUrl}/jobs/${job.id}`,
  };
}
