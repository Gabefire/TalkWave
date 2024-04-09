import { Outlet, useNavigate } from "react-router-dom";
import "./main.css";
import Header from "./header/header";
import SideBar from "./side_bar/side_bar";
import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../../contexts/authProvider";
import { ACTION_TYPE, channelListReducer } from "../../reducers/channelReducer";
import { channelType } from "../../types/messages";
import { createContext } from "vm";

const initialState = [] as channelType[];
type channelListContextType = {
  channelDispatch: channelType[];
  dispatch: React.Dispatch<ACTION_TYPE>;
};

const ChannelListContext = createContext({} as channelListContextType);

function MainRoot() {
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const { token } = useContext(AuthContext);
  const [channelDispatch, dispatch] = useReducer(
    channelListReducer,
    initialState
  );

  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      setValid(false);
      navigate("/");
    } else {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.getItem("auth");
      setValid(true);
    }
  }, [navigate, token]);

  return (
    <ChannelListContext.Provider value={{ channelDispatch, dispatch }}>
      {valid ? (
        <div className="app">
          <Header />
          <div className="message-body">
            <Outlet />
          </div>
          <SideBar />
        </div>
      ) : undefined}
    </ChannelListContext.Provider>
  );
}

export default MainRoot;
