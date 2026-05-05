import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute
 * Wraps any route that requires authentication.
 * - While auth is being verified (first load), show a spinner so we don't flash /login.
 * - If unauthenticated, redirect to /login and remember where the user was trying to go.
 * - If authenticated, render the child route via <Outlet />.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Pass the attempted URL in state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;