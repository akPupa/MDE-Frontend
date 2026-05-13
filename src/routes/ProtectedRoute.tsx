import { useAuthStore } from "@stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowedRoles?: string[];
};

export function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, user } = useAuthStore();

  const role = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}