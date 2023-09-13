import { createContext, useState } from "react";
import "./App.css";
import { messageQueryType } from "../../types/messages";

import Header from "./header";
import SideBar from "./side_bar";
import Messages from "./messages";

export const MessageQueryContext = createContext({
  name: "",
  type: null as string | null,
} as messageQueryType);

function App() {
  const [messageQuery, setMessageQuery] = useState({} as messageQueryType);

  const updateMessageQuery = (data: messageQueryType): void => {
    setMessageQuery(data);
  };

  return (
    <MessageQueryContext.Provider value={messageQuery}>
      <div className="app">
        <Header />
        <div className="body">
          <Messages />
        </div>
        <SideBar updateMessageQuery={updateMessageQuery} />
      </div>
    </MessageQueryContext.Provider>
  );
}

export default App;
