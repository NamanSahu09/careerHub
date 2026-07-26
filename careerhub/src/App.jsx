import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes/routerpath.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import CandidateLoginPage from "./pages/auth/CandidateLoginPage.jsx";
import CandidateRegisterPage from "./pages/auth/CandidateRegisterPage.jsx";
import EmployerLoginPage from "./pages/auth/EmployerLoginPage.jsx";
import EmployerRegisterPage from "./pages/auth/EmployerRegisterPage.jsx";

import PostJobPage from "./pages/employer/PostJobPage.jsx";
import SearchResumesPage from "./pages/employer/SearchResumesPage.jsx";

import CandidateDashboardPage from "./pages/candidate/CandidateDashboardPage.jsx";
import ResumeBuilderPage from "./pages/candidate/ResumeBuilderPage.jsx";
import SalaryGuidePage from "./pages/candidate/SalaryGuidePage.jsx";
import MockInterviewPage from "./pages/candidate/MockInterviewPage.jsx";

import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminJobsPage from "./pages/admin/AdminJobsPage.jsx";
import AdminCandidatesPage from "./pages/admin/AdminCandidatesPage.jsx";

import PricingPage from "./pages/employer/PricingPage.jsx";
import NewsroomPage from "./pages/NewsroomPage.jsx";

import ChatWidget from "./components/ChatWidget.jsx";
//  changes
/**
 * App.jsx owns only route -> page wiring. Each page composes its own
 * components; shared providers (Router, Auth, Helmet) live in main.jsx.
 * ChatWidget is rendered outside <Routes> so it persists on every page.
 */
export default function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route path={ROUTES.CANDIDATE_LOGIN} element={<CandidateLoginPage />} />
        <Route path={ROUTES.CANDIDATE_REGISTER} element={<CandidateRegisterPage />} />
        <Route path={ROUTES.EMPLOYER_LOGIN} element={<EmployerLoginPage />} />
        <Route path={ROUTES.EMPLOYER_REGISTER} element={<EmployerRegisterPage />} />

        <Route
          path={ROUTES.CANDIDATE_DASHBOARD}
          element={
            <ProtectedRoute role="candidate" redirectTo={ROUTES.CANDIDATE_LOGIN}>
              <CandidateDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.RESUME_BUILDER}
          element={
            <ProtectedRoute role="candidate" redirectTo={ROUTES.CANDIDATE_LOGIN}>
              <ResumeBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MOCK_INTERVIEW}
          element={
            <ProtectedRoute role="candidate" redirectTo={ROUTES.CANDIDATE_LOGIN}>
              <MockInterviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.POST_JOB}
          element={
            <ProtectedRoute role="employer" redirectTo={ROUTES.EMPLOYER_LOGIN}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER_SEARCH_RESUMES}
          element={
            <ProtectedRoute role="employer" redirectTo={ROUTES.EMPLOYER_LOGIN}>
              <SearchResumesPage />
            </ProtectedRoute>
          }
        />

        {/* Public static content pages */}
        <Route path={ROUTES.PRICING} element={<PricingPage />} />
        <Route path={ROUTES.SALARY_GUIDE} element={<SalaryGuidePage />} />
        <Route path={ROUTES.NEWSROOM} element={<NewsroomPage />} />

        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute role="admin" redirectTo={ROUTES.ADMIN_LOGIN}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_JOBS}
          element={
            <ProtectedRoute role="admin" redirectTo={ROUTES.ADMIN_LOGIN}>
              <AdminJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_CANDIDATES}
          element={
            <ProtectedRoute role="admin" redirectTo={ROUTES.ADMIN_LOGIN}>
              <AdminCandidatesPage />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>

      {/* CareerBot — floats on every page */}
      <ChatWidget />
    </>
  );
}

