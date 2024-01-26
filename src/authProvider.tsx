import axios from "axios";
import {
  ReactElement,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const AuthContext = createContext({
  userName: null as string | null,
  setUserName: (userName: string): void => {
    userName;
  },
  token: null as string | null,
  setToken: (token: string | null): void => {
    token;
  },
});

function AuthProvider({ children }: { children: ReactElement }) {
  const [token, setToken_] = useState(localStorage.getItem("auth"));
  const [userName, setUserName_] = useState("");

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  const setUserName = (userName: string) => {
    setUserName_(userName);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("auth", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("auth");
    }
  }, [token]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userName");
    }
  }, [userName]);

  const contextValue = useMemo(
    () => ({
      userName,
      setUserName,
      token,
      setToken,
    }),
    [token, userName]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
