import { Helmet } from "react-helmet-async";
import { LogOut } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import PostJobForm from "../../components/employer/PostJobForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function PostJobPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <Helmet>
        <title>Post a Job — CareerHub India</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="bg-bg min-h-[70vh] py-12 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy">Post a new job</h1>
            <p className="text-sm text-text-muted mt-1">
              Posting as <span className="font-medium text-navy">{user?.name || user?.email}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-navy"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
        <PostJobForm />
      </main>
      <Footer />
    </>
  );
}
