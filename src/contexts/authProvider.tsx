import axios from "axios";
import "react";
import {
  ReactElement,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authContextType } from "../types/auth";

export const AuthContext: React.Context<authContextType> = createContext({
  userName: null as string | null,
  setUserName: (userName: string | null): void => {
    userName;
  },
  token: null as string | null,
  setToken: (token: string | null): void => {
    token;
  },
  userId: null as string | null,
  setUserId: (userId: string | null): void => {
    userId;
  },
});

function AuthProvider({ children }: { children: ReactElement }) {
  const [token, setToken_] = useState(localStorage.getItem("auth"));
  const [userName, setUserName_] = useState(localStorage.getItem("userName"));
  const [userId, setUserId_] = useState(localStorage.getItem("userId"));

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  const setUserName = (userName: string | null) => {
    setUserName_(userName);
  };

  const setUserId = (userId: string | null) => {
    setUserId_(userId);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
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

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  });

  const contextValue = useMemo(
    () => ({
      userName,
      setUserName,
      token,
      setToken,
      userId,
      setUserId,
    }),
    [token, userName, userId]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
