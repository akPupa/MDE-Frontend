import { Outlet } from "react-router-dom";
import "../index.css";

export function AuthLayout() {
  return (
    <div className="auth-wrapper">
      {/* No header / sidebar */}
      <Outlet />
    </div>
  );
}
