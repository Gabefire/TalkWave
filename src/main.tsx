import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Auth from "./components/auth/auth.tsx";
import Login from "./components/auth/login.tsx";
import SignUp from "./components/auth/sign_up.tsx";

import { login } from "./components/auth/auth_util.ts";
import AuthRoot from "./components/auth/auth_root.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "auth",
    element: <AuthRoot />,
    children: [
      { index: true, element: <Auth /> },
      { path: "login", element: <Login login={login} /> },
      { path: "sign-up", element: <SignUp /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
