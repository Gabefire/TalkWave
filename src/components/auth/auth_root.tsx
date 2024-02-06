import { Outlet } from "react-router-dom";
import "./auth.css";

export default function AuthRoot() {
  return (
    <div className="auth">
      <Outlet />
    </div>
  );
}
