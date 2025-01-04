import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthRoute from "./routes/AuthRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <AuthRoute />
    </BrowserRouter>
  );
};

export default App;
