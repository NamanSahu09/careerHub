import { Helmet } from "react-helmet-async";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import CandidateLoginForm from "../../components/auth/CandidateLoginForm.jsx";

export default function CandidateLoginPage() {
  return (
    <>
      <Helmet>
        <title>Candidate Login — CareerHub India</title>
        <meta name="description" content="Log in to your CareerHub candidate profile to track applications and get matched to new roles." />
      </Helmet>
      <AuthLayout
        eyebrow="Job seekers"
        title="Every application, tracked in one place."
        subtitle="Save jobs, apply in one click, and see exactly where each application stands."
        panelColor="var(--color-navy)"
      >
        <CandidateLoginForm />
      </AuthLayout>
    </>
  );
}
