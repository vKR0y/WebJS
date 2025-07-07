import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";

// React 18+ entrypoint
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
