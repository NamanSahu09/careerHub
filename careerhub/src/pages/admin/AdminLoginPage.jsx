import { Helmet } from "react-helmet-async";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AdminLoginForm from "../../components/auth/AdminLoginForm.jsx";

export default function AdminLoginPage() {
  return (
    <>
      <Helmet>
        <title>Admin Login — CareerHub India</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout
        eyebrow="Staff access"
        title="Keep the marketplace healthy."
        subtitle="Review flagged postings, manage companies, and keep listings accurate."
        panelColor="#0B1420"
      >
        <AdminLoginForm />
      </AuthLayout>
    </>
  );
}
