import { useAuthStore } from "@stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

export function PublicRoute() {
  const { isAuthenticated } = useAuthStore()

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}
