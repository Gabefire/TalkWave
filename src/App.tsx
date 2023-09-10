import { useState } from "react";
import "./App.css";

function App() {
  const [messageQuery, setMessageQuery] = useState({})
  const setMessageQuery = () => 
  return (
    <>
      <Header />
      <SideBar />
      <Messages />
    </>
  );
}

export default App;
