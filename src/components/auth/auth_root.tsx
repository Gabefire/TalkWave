import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./auth.css";
import { createContext, useEffect, useState } from "react";
import { authUtilContextType } from "../../types/auth";
import { TailSpin } from "react-loader-spinner";

export const AuthUtilContext: React.Context<authUtilContextType> =
  createContext({});

export default function AuthRoot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingLogin, setLoadingLogin_] = useState(false);

  const setLoadingLogin = (loading: boolean) => {
    setLoadingLogin_(loading);
  };

  useEffect(() => {
    const noRedirect = ["/edit-profile"];
    if (
      localStorage.getItem("auth") &&
      !noRedirect.includes(location.pathname)
    ) {
      navigate("/main");
    }
  }, [location.pathname, navigate]);

  const authUtilContextValue: authUtilContextType = {
    setLoadingLogin,
  };
  return (
    <div className="auth">
      <AuthUtilContext.Provider value={authUtilContextValue}>
        {loadingLogin ? (
          <TailSpin
            height="40"
            width="40"
            color="white"
            ariaLabel="tail-spin-loading"
            wrapperClass="load-login"
          />
        ) : (
          <Outlet />
        )}
      </AuthUtilContext.Provider>
    </div>
  );
}
