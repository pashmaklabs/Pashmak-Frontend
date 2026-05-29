import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function ProtectedLayout() {
  const token = Cookies.get("pashmak_authentication");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedLayout;
