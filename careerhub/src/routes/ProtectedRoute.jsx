import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Gates a route behind a required role. Redirects to `redirectTo` (typically
 * the matching login page) when there's no user or the role doesn't match.
 */
export default function ProtectedRoute({ role, redirectTo, children }) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}
