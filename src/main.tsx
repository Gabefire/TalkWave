import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainRoot from "./components/main/main_root.tsx";
import "./index.css";
import MainPage from "./components/auth/main_page.tsx";
import Login from "./components/auth/login.tsx";
import SignUp from "./components/auth/sign_up.tsx";
import EditProfile from "./components/auth/edit_profile.tsx";
import AuthRoot from "./components/auth/auth_root.tsx";
import Messages from "./components/main/message/messages.tsx";
import CreateGroup from "./components/main/message/create_group.tsx";
import axios from "axios";
import AuthProvider from "./contexts/authProvider.tsx";
import Welcome from "./components/main/message/welcome.tsx";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
  {
    path: "/main",
    element: <MainRoot />,
    children: [
      { index: true, element: <Welcome /> },
      { path: ":type/:id", element: <Messages /> },
      { path: "create-group", element: <CreateGroup /> },
    ],
  },
  {
    path: "/",
    element: <AuthRoot />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <Login /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "edit-profile", element: <EditProfile /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
