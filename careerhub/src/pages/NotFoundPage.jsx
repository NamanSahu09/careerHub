import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ROUTES } from "../routes/routerpath.jsx";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — CareerHub India</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-5 bg-bg">
        <p className="font-mono-num text-sm text-text-muted">404</p>
        <h1 className="font-display font-bold text-3xl text-navy mt-2">That page moved on.</h1>
        <p className="text-text-muted text-sm mt-2 max-w-sm">
          The link you followed may be broken, or the page may have been removed.
        </p>
        <Link
          to={ROUTES.HOME}
          className="mt-6 bg-gold text-navy font-semibold text-sm rounded-xl px-5 py-2.5 hover:brightness-105 transition"
        >
          Back to home
        </Link>
      </div>
    </>
  );
}
