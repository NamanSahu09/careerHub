import { Helmet } from "react-helmet-async";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import EmployerRegisterForm from "../../components/auth/EmployerRegisterForm.jsx";

export default function EmployerRegisterPage() {
  return (
    <>
      <Helmet>
        <title>Register Your Company — CareerHub India</title>
        <meta name="description" content="Register your company on CareerHub to post job openings and search candidate profiles." />
      </Helmet>
      <AuthLayout
        eyebrow="Employers"
        title="62,000+ companies already hire here."
        subtitle="Set up your company profile once, then post as many openings as you need."
        panelColor="var(--color-violet)"
      >
        <EmployerRegisterForm />
      </AuthLayout>
    </>
  );
}
