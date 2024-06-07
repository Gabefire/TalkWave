import { authContextType } from "../types/auth";

export const userContext: authContextType = {
    userName: "test",
    setUserName: (userName: string | null) => {
      userName;
    },
    token: "123",
    setToken: (token: string | null) => {
      token;
    },
    userId: "1",
    setUserId: (userId: string | null) => {
      userId;
    },
  };