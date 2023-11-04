import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import "./main.css";
import { messageQueryType } from "../../types/messages";

import Header from "./header";
import SideBar from "./side_bar";

export const MessageQueryContext = createContext({
  name: "",
  type: null as string | null,
} as messageQueryType);

function MainRoot() {
  const [messageQuery, setMessageQuery] = useState({} as messageQueryType);

  const updateMessageQuery = (data: messageQueryType): void => {
    setMessageQuery(data);
  };

  return (
    <MessageQueryContext.Provider value={messageQuery}>
      <div className="app">
        <Header />
        <div className="body">
          <Outlet />
        </div>
        <SideBar updateMessageQuery={updateMessageQuery} />
      </div>
    </MessageQueryContext.Provider>
  );
}

export default MainRoot;
