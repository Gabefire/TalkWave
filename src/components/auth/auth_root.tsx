import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./auth.css";
import { useEffect } from "react";

export default function AuthRoot() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const noRedirect = ["/edit-profile"];
    if (
      localStorage.getItem("auth") &&
      !noRedirect.includes(location.pathname)
    ) {
      navigate("/main");
    }
  }, [location.pathname, navigate]);
  return (
    <div className="auth">
      <Outlet />
    </div>
  );
}
