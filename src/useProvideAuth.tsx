import { useContext } from "react";
import { AuthContext } from "./contexts/authProvider";
import {
  loginErrorType,
  loginUserDtoType,
  loginUserType,
  signUpErrorType,
  signUpUserType,
} from "./types/auth";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useProvideAuth = () => {
  const { setToken, setUserName } = useContext(AuthContext);
  const navigator = useNavigate();

  const login = async (
    loginUser: loginUserType
  ): Promise<void | loginErrorType[]> => {
    try {
      const userDto = (
        await axios.post<loginUserDtoType>("/api/User/login", loginUser)
      ).data;
      setToken(userDto.token);
      setUserName(userDto.userName);
      navigator("/main");
    } catch (err) {
      if (typeof err === "string") {
        return [{ root: err }];
      } else if (axios.isAxiosError(err)) {
        return [{ root: err.response?.data }];
      }
    }
  };

  const signUp = async (
    signUpUser: signUpUserType
  ): Promise<void | signUpErrorType[]> => {
    try {
      await axios.post("/api/User/register", signUpUser);
      const loginErrors = await login({
        email: signUpUser.email,
        password: signUpUser.password,
      });
      if (loginErrors) {
        return loginErrors;
      }
    } catch (err) {
      if (typeof err === "string") {
        return [{ root: err }];
      } else if (axios.isAxiosError(err)) {
        if (err.response?.status == 409) {
          return [{ root: err.response?.data }];
        } else {
          return [{ root: "Bad Connection" }];
        }
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
  };

  return {
    login,
    signUp,
    logout,
  };
};

export default useProvideAuth;
