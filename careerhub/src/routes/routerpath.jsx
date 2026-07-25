/**
 * Single source of truth for every route in the app.
 * Import ROUTES anywhere you need an href/navigate target instead of
 * hardcoding strings — keeps <Link> targets and <Route path> in sync.
 */
export const ROUTES = {
  HOME: "/",
  JOBS: "/jobs",
  JOB_DETAIL: "/jobs/:id",
  jobDetail: (id) => `/jobs/${id}`,

  CANDIDATE_LOGIN: "/login/candidate",
  CANDIDATE_REGISTER: "/register/candidate",
  CANDIDATE_DASHBOARD: "/candidate/dashboard",
  RESUME_BUILDER: "/resume-builder",
  MOCK_INTERVIEW: "/interview",

  EMPLOYER_LOGIN: "/login/employer",
  EMPLOYER_REGISTER: "/register/employer",
  POST_JOB: "/employer/post-job",
  EMPLOYER_SEARCH_RESUMES: "/employer/search-resumes",
  PRICING: "/pricing",

  SALARY_GUIDE: "/salary-guide",
  NEWSROOM: "/newsroom",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_JOBS: "/admin/jobs",
  ADMIN_CANDIDATES: "/admin/candidates",

  NOT_FOUND: "*",
};


export default ROUTES;
