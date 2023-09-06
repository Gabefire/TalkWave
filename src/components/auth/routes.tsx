import { Route } from "react-router-dom";

import { signUpUserType, errorHandlerFuncType } from "../../types/auth/sign_up";

import Auth from "./auth";
import Login from "./login";
import SignUp from "./sign_up";

export default function AuthRoutes() {
  const signUp = (
    signUpUser: signUpUserType,
    errorHandler: errorHandlerFuncType
  ) => {
    // API call to sign up user return JWT token and log in
    if (signUpUser.username === "error") {
      return errorHandler(new Error("test error"));
    } else {
      return;
    }
  };
  const login = (
    username: string,
    password: string,
    errorHandler: errorHandlerFuncType
  ): void | Error => {
    // API call to log in JWT token added to local storage
    if (username === "error") {
      return errorHandler(new Error("test error"));
    } else {
      localStorage.setItem("user", username);
      localStorage.setItem("password", password);
      return;
    }
  };

  return (
    <>
      <Route index element={<Auth />} login={login} />
      <Route path="login" element={<Login login={login} />} />
      <Route path="sign-up" element={<SignUp signUp={signUp} />} />
    </>
  );
}
