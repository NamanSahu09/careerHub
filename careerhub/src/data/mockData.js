export const jobRoles = [
  "Software Engineer", "Product Manager", "Data Analyst", "UI/UX Designer",
  "DevOps Engineer", "Sales Executive", "HR Manager", "Digital Marketer",
];

export const categories = [
  { id: "it-software", name: "IT & Software", count: 48213, icon: "code" },
  { id: "sales", name: "Sales & BD", count: 21894, icon: "trending" },
  { id: "marketing", name: "Marketing", count: 15602, icon: "megaphone" },
  { id: "finance", name: "Finance & Accounts", count: 18340, icon: "wallet" },
  { id: "hr", name: "HR & Admin", count: 9873, icon: "users" },
  { id: "design", name: "Design & Creative", count: 6421, icon: "palette" },
  { id: "operations", name: "Operations", count: 12045, icon: "layers" },
  { id: "customer-support", name: "Customer Support", count: 8790, icon: "headset" },
];

export const companies = [
  { name: "Nimbus Systems", openings: 214, initial: "N", color: "#6C5CE7" },
  { name: "Bluepeak Retail", openings: 87, initial: "B", color: "#F5A623" },
  { name: "Orbital Finserv", openings: 132, initial: "O", color: "#2D9CDB" },
  { name: "Kiranatech", openings: 56, initial: "K", color: "#00B894" },
  { name: "Vertex Health", openings: 98, initial: "V", color: "#EB5757" },
  { name: "Sanchar Media", openings: 41, initial: "S", color: "#F5A623" },
];

export const jobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer (React)",
    company: "Nimbus Systems",
    logo: "N",
    color: "#6C5CE7",
    location: "Bengaluru",
    mode: "Hybrid",
    experience: "4-7 yrs",
    salary: "₹18-28 LPA",
    posted: "2 days ago",
    skills: ["React", "TypeScript", "Redux", "REST APIs"],
    applicants: 143,
    urgent: true,
    description:
      "Own the frontend architecture for our flagship SaaS product, mentor junior engineers, and collaborate closely with design and product to ship features used by 2M+ users.",
  },
  {
    id: 2,
    title: "Product Manager - Growth",
    company: "Bluepeak Retail",
    logo: "B",
    color: "#F5A623",
    location: "Mumbai",
    mode: "On-site",
    experience: "3-6 yrs",
    salary: "₹22-32 LPA",
    posted: "5 hrs ago",
    skills: ["Product Strategy", "SQL", "A/B Testing"],
    applicants: 89,
    urgent: false,
    description:
      "Drive the growth roadmap across acquisition and retention. Work with data, engineering, and marketing to identify and ship high-impact experiments.",
  },
  {
    id: 3,
    title: "Data Analyst - Business Intelligence",
    company: "Orbital Finserv",
    logo: "O",
    color: "#2D9CDB",
    location: "Pune",
    mode: "Remote",
    experience: "1-3 yrs",
    salary: "₹8-14 LPA",
    posted: "1 day ago",
    skills: ["SQL", "Power BI", "Python"],
    applicants: 231,
    urgent: false,
    description:
      "Build dashboards and reports that power decision-making across finance and risk teams. Translate raw data into clear, actionable insight.",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Kiranatech",
    logo: "K",
    color: "#00B894",
    location: "Hyderabad",
    mode: "Hybrid",
    experience: "2-5 yrs",
    salary: "₹14-22 LPA",
    posted: "3 days ago",
    skills: ["AWS", "Kubernetes", "CI/CD", "Terraform"],
    applicants: 67,
    urgent: true,
    description:
      "Own our cloud infrastructure, build resilient CI/CD pipelines, and help the engineering org ship faster without sacrificing reliability.",
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "Vertex Health",
    logo: "V",
    color: "#EB5757",
    location: "Delhi NCR",
    mode: "On-site",
    experience: "2-4 yrs",
    salary: "₹10-16 LPA",
    posted: "6 hrs ago",
    skills: ["Figma", "Design Systems", "User Research"],
    applicants: 112,
    urgent: false,
    description:
      "Shape the end-to-end patient experience across our web and mobile apps. Partner with PMs and engineers from concept to launch.",
  },
  {
    id: 6,
    title: "Performance Marketing Manager",
    company: "Sanchar Media",
    logo: "S",
    color: "#F5A623",
    location: "Remote",
    mode: "Remote",
    experience: "3-5 yrs",
    salary: "₹12-20 LPA",
    posted: "1 day ago",
    skills: ["Google Ads", "Meta Ads", "Analytics"],
    applicants: 54,
    urgent: false,
    description:
      "Plan and scale paid acquisition across search and social. Own budget allocation and reporting for a fast-growing D2C portfolio.",
  },
];

export const testimonials = [
  {
    name: "Ritika Sharma",
    role: "Landed a role as Product Manager",
    quote:
      "The application tracker kept me from losing track of anything, and I heard back from three companies in the same week.",
  },
  {
    name: "Arjun Mehta",
    role: "Landed a role as DevOps Engineer",
    quote:
      "I filtered by remote and salary range and had a shortlist worth applying to in under ten minutes.",
  },
  {
    name: "Fatima Khan",
    role: "Landed a role as UI/UX Designer",
    quote:
      "Recruiters reached out to me directly after I updated my profile. That never happened on other platforms.",
  },
];

export const stats = [
  { label: "Live openings", value: "1.4L+" },
  { label: "Companies hiring", value: "62,000+" },
  { label: "Profiles reviewed daily", value: "3.2L+" },
  { label: "Avg. response time", value: "48 hrs" },
];
