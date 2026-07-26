# CareerHub — Job Portal Frontend (React + MERN-ready)

A job-portal frontend inspired by the naukri.com category of product, built as
an original design system rather than a copy — its own branding, palette, and
copy — so you can use it as a real project foundation.

## Stack
- **React 18 + Vite** — fast dev server, small production bundle
- **Tailwind CSS** — utility styling, driven by CSS-variable design tokens in `src/index.css`
- **react-router-dom** — installed and ready for multi-page routing (job detail pages, company pages, etc.)
- **react-helmet-async** — per-page `<title>`/meta tags for SEO
- **lucide-react** — icon set

## Run it
```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to /dist
npm run preview    # preview the production build
```

## Project structure
```
src/
  main.jsx            Renders <App>, wrapped in BrowserRouter + HelmetProvider + AuthProvider
  App.jsx             Pure route table — maps ROUTES paths to page components
  routes/
    routerpath.jsx     Single source of truth for every path (import ROUTES, not hardcoded strings)
    ProtectedRoute.jsx Redirects to the right login page if role doesn't match
  context/
    AuthContext.jsx    Mock login/register/logout for candidate, employer, admin roles
  pages/
    HomePage.jsx
    NotFoundPage.jsx
    auth/
      CandidateLoginPage.jsx / CandidateRegisterPage.jsx
      EmployerLoginPage.jsx / EmployerRegisterPage.jsx
    employer/
      PostJobPage.jsx           (protected — employer role required)
    admin/
      AdminLoginPage.jsx
      AdminDashboardPage.jsx / AdminJobsPage.jsx / AdminCandidatesPage.jsx  (protected — admin role required)
  components/
    Navbar.jsx, Hero.jsx, JobList.jsx, JobCard.jsx, JobDetailModal.jsx,
    CategoryGrid.jsx, TrustBar.jsx, TopCompanies.jsx, Testimonials.jsx, Footer.jsx
    auth/
      AuthLayout.jsx, FormField.jsx
      CandidateLoginForm.jsx, CandidateRegisterForm.jsx
      EmployerLoginForm.jsx, EmployerRegisterForm.jsx
      AdminLoginForm.jsx
    employer/
      PostJobForm.jsx
    admin/
      AdminLayout.jsx, AdminSidebar.jsx, StatCard.jsx, JobsTable.jsx, CandidatesTable.jsx
  data/
    mockData.js         Sample jobs/companies/categories — swap for API calls
    mockAdminData.js     Sample admin dashboard stats/tables
  utils/
    seo.js               schema.org JobPosting JSON-LD builder
index.html               Meta tags, Open Graph, Twitter cards, Organization/WebSite JSON-LD
public/robots.txt
public/sitemap.xml
```

### Routes
| Path | Page | Access |
|---|---|---|
| `/` | HomePage | Public |
| `/login/candidate`, `/register/candidate` | Candidate auth | Public |
| `/login/employer`, `/register/employer` | Employer auth | Public |
| `/employer/post-job` | PostJobPage | Employer only (redirects to employer login) |
| `/admin/login` | AdminLoginPage | Public (demo creds: `admin@careerhub.example` / `admin123`) |
| `/admin/dashboard`, `/admin/jobs`, `/admin/candidates` | Admin portal | Admin only (redirects to admin login) |
| `*` | NotFoundPage | Public |

## Connected to a real backend

This frontend now talks to the `careerhub-backend` Express/MongoDB API —
it's no longer a mock. Here's exactly how the two are wired, end to end.

### 1. Run both projects together
```bash
# Terminal 1 — backend
cd careerhub-backend
npm install
cp .env.example .env        # set MONGO_URI, JWT_SECRET, CLIENT_URL=http://localhost:5173
npm run seed:admin           # one-time: creates the admin account
npm run dev                  # http://localhost:5001

# Terminal 2 — frontend
cd careerhub
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5001/api
npm run dev                  # http://localhost:5173
```
The two `.env` values that must agree: backend's `CLIENT_URL` = frontend's
dev origin, and frontend's `VITE_API_URL` = backend's `/api` base. If these
don't match, the browser will block the auth cookie (CORS).

### 2. The API layer — `src/api/`
| File | What it does |
|---|---|
| `client.js` | One shared `axios` instance, `baseURL` from `VITE_API_URL`, **`withCredentials: true`** so the browser sends/accepts the backend's httpOnly cookie |
| `authApi.js` | `registerCandidate`, `registerEmployer`, `login`, `logout`, `me` |
| `jobsApi.js` | `list`, `detail`, `create`, `mine`, `update`, `remove` |
| `adminApi.js` | `stats`, `jobs`, `updateJobStatus`, `candidates`, `employers`, `setUserActive` |
| `apiError.js` | Normalizes any axios error (validation, auth, or network failure) into `{ code, message, errors }` matching the backend's error shape |

### 3. Auth — `AuthContext.jsx`
No longer a mock. `login()`/`register()` call the real endpoints and store
only the returned **user object** in React state — never a token, since the
JWT itself lives in an httpOnly cookie the browser manages automatically.
On app load, it calls `GET /auth/me` once to check whether an existing
session cookie is still valid, so refreshing the page keeps you logged in
(a real change from the earlier mock version, which logged you out on
every refresh by design).

Every auth form (`CandidateLoginForm`, `CandidateRegisterForm`,
`EmployerLoginForm`, `EmployerRegisterForm`, `AdminLoginForm`) now:
- `await`s the API call and shows a disabled/"…" button state while it's in flight
- Surfaces the backend's field-level validation errors (`fieldErrors.email`, `fieldErrors.phone`, etc.) directly under the relevant input
- Shows the backend's top-level `message` (e.g. "Password must be between 8 and 15 characters") in an alert banner

### 4. Jobs — `HomePage.jsx` and `PostJobForm.jsx`
`HomePage` fetches `GET /jobs` on mount and renders real listings. If the
API is unreachable (backend not running), it falls back to
`src/data/mockData.js` and shows a small "showing sample listings" notice
— so the UI is never broken, even before you've started the backend.
`PostJobForm` posts to `POST /jobs` as the logged-in employer (the JWT
cookie authenticates the request automatically) and shows the backend's
validation errors per field if something's invalid.

### 5. Admin portal
`AdminDashboardPage`, `AdminJobsPage`, and `AdminCandidatesPage` all fetch
from `/api/admin/*` (protected, admin-role-only on the backend) with the
same mock-data fallback pattern as the homepage.

### `ProtectedRoute` — a client-side convenience, not the real gate
`ProtectedRoute.jsx` redirects based on `AuthContext` state so the UI feels
instant, but the actual security boundary is the backend: every protected
endpoint (`POST /jobs`, all of `/admin/*`) re-checks the JWT and role
server-side regardless of what the client thinks. A user can't get real
data by tampering with client state — the API will 401/403 either way.

## SEO notes (important for a job board specifically)

A client-rendered React SPA is the single biggest SEO weakness for a job
board, because most of your organic traffic should come from Google
indexing individual job postings — and crawlers need real HTML, not just a
JS bundle, to rank those pages well. To get this right in production:

1. **Render job detail pages on the server.** Use Next.js, Remix, or Vite SSR
   for at least `/jobs/:id` and `/companies/:slug` routes. This project's
   components are already presentational and easy to port into an SSR
   framework — `JobDetailModal`'s content is a good starting point for a
   real `/jobs/:id` page.
2. **Emit `JobPosting` JSON-LD per job** — see `src/utils/seo.js`. Google
   Jobs and job-search rich results are driven entirely by this schema.
   `datePosted`, `validThrough`, and `baseSalary` matter most for eligibility.
3. **Unique `<title>` and meta description per job/category page**, not just
   the homepage — handled today via `react-helmet-async`, extend it per route.
4. **Generate `sitemap.xml` dynamically** on the backend, looping over every
   live job so new postings get crawled within hours, not whenever you
   remember to redeploy. A stub script location is noted in `public/sitemap.xml`.
5. **Canonical URLs** on any paginated or filtered `/jobs?...` view, pointing
   back to the clean unfiltered URL, to avoid thin/duplicate-content pages
   competing with each other.
6. **Core Web Vitals** — this build already lazy-loads nothing above the
   fold, avoids layout shift with fixed-size logo tiles, and keeps the JS
   bundle small (~193 kB / ~61 kB gzipped); keep an eye on this as you add
   features.
7. **Semantic HTML** — the markup uses `<header>`, `<main>`, `<article>` for
   job cards, `<figure>`/`<blockquote>` for testimonials, and real `<label>`
   elements tied to inputs, which helps both accessibility and crawlability.

## Design notes
Palette and type tokens live in `src/index.css` (`:root`) and
`tailwind.config.js`: navy `#0B1F3A` for structure/trust, gold `#F5A623` for
primary actions, violet `#6C5CE7` for category accents, teal `#00B894` for
live/urgent signals. Display type is Space Grotesk, body is Inter, and
numeric data (salaries, counts) uses IBM Plex Mono to read as data rather
than prose.
