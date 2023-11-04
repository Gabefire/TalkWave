import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainRoot from "./components/main/main_root.tsx";
import "./index.css";
import MainPage from "./components/auth/main_page.tsx";
import Login from "./components/auth/login.tsx";
import SignUp from "./components/auth/sign_up.tsx";

import { login, signUp } from "./components/auth/auth_util.ts";
import AuthRoot from "./components/auth/auth_root.tsx";
import Messages from "./components/main/messages.tsx";

const router = createBrowserRouter([
  {
    path: "/main",
    element: <MainRoot />,
    children: [
      { path: ":type/:id", element: <Messages /> },
      { path: "join-group", element: <JoinGroup /> },
      { path: "create-group", element: <CreateGroup /> },
      { path: "message-user", element: <MessageUser /> },
    ],
  },
  {
    path: "/",
    element: <AuthRoot />,
    children: [
      { index: true, element: <MainPage login={login} /> },
      { path: "login", element: <Login login={login} /> },
      { path: "sign-up", element: <SignUp login={login} signUp={signUp} /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
