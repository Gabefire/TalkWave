import { createContext, useEffect, useState } from "react";
import "../../App.css";
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
      <Header />
      <SideBar updateMessageQuery={updateMessageQuery} />
      <Messages />
    </MessageQueryContext.Provider>
  );
}

export default App;
