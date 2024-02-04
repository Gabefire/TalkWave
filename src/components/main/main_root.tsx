import { Outlet, useNavigate } from "react-router-dom";
import "./main.css";

import Header from "./header/header";
import SideBar from "./side_bar/side_bar";
import axios from "axios";

function MainRoot() {
  const navigate = useNavigate();

  if (!localStorage.getItem("auth")) {
    navigate("/login");
  } else {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("auth");
  }

  return (
    <div className="app">
      <Header />
      <Outlet />

      <SideBar />
    </div>
  );
}

export default MainRoot;
