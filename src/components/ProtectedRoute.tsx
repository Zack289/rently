import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children, role }: { children: JSX.Element; role?: "admin" | "host" }) => {
  const { user, roles, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" state={{ from: loc.pathname + loc.search }} replace />;
  if (role && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
};
