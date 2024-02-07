import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./auth.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/authProvider";

export default function AuthRoot() {
  const navigate = useNavigate();
  const param = useParams();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const noRedirect = ["/edit-profile"];
    if (
      localStorage.getItem("auth") &&
      typeof param === "string" &&
      !(param in noRedirect)
    ) {
      navigate("/main");
    }
  }, [navigate, token, param]);
  return (
    <div className="auth">
      <Outlet />
    </div>
  );
}
