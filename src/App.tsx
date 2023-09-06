import { Route, Routes } from "react-router-dom";
import "./App.css";

import AuthRoutes from "./components/auth/routes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/">
          <AuthRoutes />
        </Route>
      </Routes>
    </>
  );
}

export default App;
