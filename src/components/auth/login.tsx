import React from "react";
import { errorHandlerFuncType } from "../../types/auth/sign_up";

interface loginType {
  login: (
    username: string,
    password: string,
    errorHandler: errorHandlerFuncType
  ) => void | Error;
}

const Login = ({ login }: loginType) => {
  const errorHandler: errorHandlerFuncType = (err) => {
    console.log(err);
  };
  const loginValdiator = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login("test", "test", errorHandler);
  };
  return (
    <form action="na">
      <h1>Login</h1>
      <label htmlFor="username" className="form-group">
        Username:
        <input
          aria-label="username"
          type="text"
          id="username"
          placeholder="Enter Username"
          className="form-input"
        />
      </label>
      <label htmlFor="password">
        Password:
        <input
          aria-label="password"
          type="text"
          id="username"
          placeholder="Enter Password"
          className="form-input"
        />
      </label>
      <button onClick={loginValdiator}>Login</button>
    </form>
  );
};

export default Login;
