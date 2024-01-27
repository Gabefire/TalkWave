import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./main.css";

import Header from "./header/header";
import SideBar from "./side_bar/side_bar";
import { AuthContext } from "../../authProvider";

function MainRoot() {
  const navigate = useNavigate();

  const user = useContext(AuthContext);
  if (!user.token) {
    navigate("/login");
  }

  return (
    <div className="app">
      <Header />
      <div className="body">
        <Outlet />
      </div>
      <SideBar />
    </div>
  );
}

export default MainRoot;
