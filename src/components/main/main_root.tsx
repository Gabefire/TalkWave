import { Outlet, useNavigate } from "react-router-dom";
import "./main.css";

import Header from "./header/header";
import SideBar from "./side_bar/side_bar";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/authProvider";

function MainRoot() {
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      setValid(false);
      navigate("/login");
    } else {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.getItem("auth");
      setValid(true);
    }
  }, [navigate, token]);

  return (
    <>
      {valid ? (
        <div className="app">
          <Header />
          <div className="message-body">
            <Outlet />
          </div>
          <SideBar />
        </div>
      ) : undefined}
    </>
  );
}

export default MainRoot;
