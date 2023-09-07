import { Route } from "react-router-dom";

import { signUpUserType, loginErrorType } from "../../types/sign_up";

import Auth from "./auth";
import Login from "./login";
import SignUp from "./sign_up";
import { date } from "zod";

export default function AuthRoutes() {
  const signUp = (
    signUpUser: signUpUserType,
    errorHandler: errorHandlerFuncType
  ) => {
    // API call to sign up user return JWT token and log in
    try {
      if (signUpUser.username === "error") {
        throw new Error("something went wrong");
      } else {
        console.log(signUpUser);
      }
    } catch (err) {
      if (typeof err === "string") {
        errorHandler([{ connection: err }]);
      } else if (err instanceof Error) {
        errorHandler([{ connection: err.message }]);
      }
    }
  };
  const login = async (user: {
    username: string;
    password: string;
  }): Promise<void | loginErrorType[]> => {
    // API call to log in JWT token added to local storage
    try {
      if (user.username === "error") {
        throw new Error("something went wrong");
      } else {
        console.log(user);
      }
    } catch (err) {
      if (typeof err === "string") {
        return [{ root: err }];
      } else if (err instanceof Error) {
        return [{ root: err.message }];
      }
    }
  };

  return (
    <>
      <Route index element={<Auth />} />
      <Route path="login" element={<Login login={login} />} />
      <Route path="sign-up" element={<SignUp />} />
    </>
  );
}
