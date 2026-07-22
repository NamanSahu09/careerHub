import { Helmet } from "react-helmet-async";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import CandidateRegisterForm from "../../components/auth/CandidateRegisterForm.jsx";

export default function CandidateRegisterPage() {
  return (
    <>
      <Helmet>
        <title>Create a Candidate Account — CareerHub India</title>
        <meta name="description" content="Create a free CareerHub profile and get matched to relevant job openings across India." />
      </Helmet>
      <AuthLayout
        eyebrow="Job seekers"
        title="Built once, matched everywhere."
        subtitle="A single profile that recruiters can find — no re-typing your resume for every application."
        panelColor="var(--color-navy)"
      >
        <CandidateRegisterForm />
      </AuthLayout>
    </>
  );
}
