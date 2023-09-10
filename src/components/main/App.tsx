import { createContext, useEffect, useState } from "react";
import "./App.css";
import { messageQueryType } from "../../types/messages";

import Header from "./header/header";
import SideBar from "./side_bar/side_bar";
import Messages from "./messages/messages";

export const MessageQueryContext = createContext({
  messageQuery: { name: "", type: null as string | null } as messageQueryType,
  user: { username: "" },
});

function App() {
  const [messageQuery, setMessageQuery] = useState({} as messageQueryType);
  const [user, setUser] = useState({} as { username: string });

  useEffect(() => {
    // get user inform with JWT
    const user = {
      username: "gabe",
    };
    setUser(user);
  }, []);

  const updateMessageQuery = (data: messageQueryType): void => {
    setMessageQuery(data);
  };

  return (
    <MessageQueryContext.Provider value={{ messageQuery, user }}>
      <Header />
      <SideBar updateMessageQuery={updateMessageQuery} />
      <Messages />
    </MessageQueryContext.Provider>
  );
}

export default App;
