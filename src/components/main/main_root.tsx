import { Outlet, useNavigate } from "react-router-dom";
import "./main.css";
import Header from "./header/header.tsx";
import SideBar from "./side_bar/side_bar.tsx";
import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../../contexts/authProvider";
import { channelListReducer } from "../../reducers/channelReducer.ts";
import { channelType } from "../../types/messages.tsx";
import ChannelListContext from "../../contexts/channelListContext.ts";

const initialState = [] as channelType[];

function MainRoot() {
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const [channelListLoading, _setChannelListLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const [channelDispatch, dispatch] = useReducer(
    channelListReducer,
    initialState
  );

  const setChannelListLoading = (loading: boolean) => {
    _setChannelListLoading(loading);
  };

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
    <ChannelListContext.Provider
      value={{
        channelDispatch,
        dispatch,
        changeLoading: setChannelListLoading,
        loading: channelListLoading,
      }}
    >
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
