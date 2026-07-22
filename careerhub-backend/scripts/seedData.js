/**
 * Run with: node scripts/seedData.js
 * Seeds full demo dataset (employers, candidates, and jobs) to MongoDB Atlas
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Job = require("../src/models/Job");

const DEMO_EMPLOYERS = [
  { name: "Suresh R.", email: "hr@nimbus.example", phone: "9876543210", password: "Employer@123", role: "employer", companyName: "Nimbus Systems" },
  { name: "Vikram S.", email: "hr@bluepeak.example", phone: "9876543211", password: "Employer@123", role: "employer", companyName: "Bluepeak Retail" },
  { name: "Ananya M.", email: "hr@orbital.example", phone: "9876543212", password: "Employer@123", role: "employer", companyName: "Orbital Finserv" },
  { name: "Pankaj K.", email: "hr@kiranatech.example", phone: "9876543213", password: "Employer@123", role: "employer", companyName: "Kiranatech" },
  { name: "Sarah J.", email: "hr@vertex.example", phone: "9876543214", password: "Employer@123", role: "employer", companyName: "Vertex Health" },
  { name: "Rajesh G.", email: "hr@sanchar.example", phone: "9876543215", password: "Employer@123", role: "employer", companyName: "Sanchar Media" }
];

const DEMO_CANDIDATES = [
  { name: "Ritika Sharma", email: "ritika@example.com", phone: "8765432101", password: "Candidate@123", role: "candidate" },
  { name: "Arjun Mehta", email: "arjun@example.com", phone: "8765432102", password: "Candidate@123", role: "candidate" },
  { name: "Fatima Khan", email: "fatima@example.com", phone: "8765432103", password: "Candidate@123", role: "candidate" },
  { name: "Karthik Iyer", email: "karthik@example.com", phone: "8765432104", password: "Candidate@123", role: "candidate" },
  { name: "Neha Verma", email: "neha@example.com", phone: "8765432105", password: "Candidate@123", role: "candidate" }
];

const DEMO_JOBS = [
  { title: "Senior Frontend Engineer (React)", companyName: "Nimbus Systems", location: "Bengaluru", mode: "Hybrid", experience: "5-8 years", salaryMin: 1500000, salaryMax: 2400000, skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS"], description: "Looking for an experienced React developer to lead our dashboard rebuild. Must have 5+ years of software design experience.", status: "Live", applicantCount: 143 },
  { title: "Product Manager - Growth", companyName: "Bluepeak Retail", location: "Mumbai", mode: "On-site", experience: "3-5 years", salaryMin: 1200000, salaryMax: 1800000, skills: ["Product Management", "A/B Testing", "Analytics"], description: "Join our core conversion optimization product squad. Work on rapid experimentation and growth funnel scaling.", status: "Live", applicantCount: 89 },
  { title: "Data Analyst - Business Intelligence", companyName: "Orbital Finserv", location: "Delhi NCR", mode: "Remote", experience: "2-4 years", salaryMin: 800000, salaryMax: 1200000, skills: ["SQL", "Python", "Tableau", "PowerBI"], description: "Transform raw transactional data into business insights. Work closely with product and operations teams.", status: "Pending review", applicantCount: 231 },
  { title: "DevOps Engineer", companyName: "Kiranatech", location: "Hyderabad", mode: "Hybrid", experience: "4-7 years", salaryMin: 1400000, salaryMax: 2200000, skills: ["AWS", "Docker", "Kubernetes", "CI/CD"], description: "Own and optimize our cloud infrastructure pipeline. Scale deployments and manage server reliability.", status: "Live", applicantCount: 67 },
  { title: "UI/UX Designer", companyName: "Vertex Health", location: "Bengaluru", mode: "Remote", experience: "3-6 years", salaryMin: 1000000, salaryMax: 1600000, skills: ["Figma", "UI Design", "User Research", "Wireframing"], description: "Design patient-facing mobile apps and healthcare provider portals. Create elegant design tokens.", status: "Flagged", applicantCount: 112 },
  { title: "Performance Marketing Manager", companyName: "Sanchar Media", location: "Pune", mode: "On-site", experience: "2-5 years", salaryMin: 600000, salaryMax: 900000, skills: ["Google Ads", "Meta Ads", "SEO", "Copywriting"], description: "Manage digital advertising budget and campaign strategies. Track ROI and conversion statistics.", status: "Live", applicantCount: 54 }
];

async function seed() {
  await connectDB();

  // Clear existing jobs and non-admin users
  console.log("[seed] Clearing existing non-admin data...");
  await Job.deleteMany({});
  await User.deleteMany({ role: { $ne: "admin" } });

  // Create admin if not exists
  const adminEmail = process.env.ADMIN_EMAIL || "admin@careerhub.example";
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    console.log("[seed] Creating admin user...");
    await User.create({
      name: process.env.ADMIN_NAME || "CareerHub Admin",
      email: adminEmail,
      phone: process.env.ADMIN_PHONE || "9999999999",
      password: process.env.ADMIN_PASSWORD || "Admin@1234",
      role: "admin"
    });
  }

  // Create employers
  console.log("[seed] Creating employers...");
  const employersMap = {};
  for (const empData of DEMO_EMPLOYERS) {
    const user = await User.create(empData);
    employersMap[empData.companyName] = user._id;
  }

  // Create candidates
  console.log("[seed] Creating candidates...");
  for (const candData of DEMO_CANDIDATES) {
    await User.create(candData);
  }

  // Create jobs
  console.log("[seed] Creating jobs...");
  for (const jobData of DEMO_JOBS) {
    const postedBy = employersMap[jobData.companyName];
    await Job.create({
      title: jobData.title,
      company: jobData.companyName,
      postedBy,
      location: jobData.location,
      mode: jobData.mode,
      experience: jobData.experience,
      salaryMin: jobData.salaryMin,
      salaryMax: jobData.salaryMax,
      skills: jobData.skills,
      description: jobData.description,
      status: jobData.status,
      applicantCount: jobData.applicantCount
    });
  }

  console.log("[seed] MongoDB Atlas database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
