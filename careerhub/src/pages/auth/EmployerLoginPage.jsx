import { Helmet } from "react-helmet-async";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import EmployerLoginForm from "../../components/auth/EmployerLoginForm.jsx";

export default function EmployerLoginPage() {
  return (
    <>
      <Helmet>
        <title>Employer Login — CareerHub India</title>
        <meta name="description" content="Log in to your CareerHub employer account to post jobs and review applicants." />
      </Helmet>
      <AuthLayout
        eyebrow="Employers"
        title="Reach candidates across every major city in India."
        subtitle="Post a role in minutes and start reviewing applicants the same day."
        panelColor="var(--color-violet)"
      >
        <EmployerLoginForm />
      </AuthLayout>
    </>
  );
}
