import React from "react";
import BackgroundCanvas from "./components/BackgroundCanvas";
import LoginForm from "./components/LoginForm";
import "./styles/main.css";

function App() {
  return (
    <div>
      <BackgroundCanvas />
      <div className="centered-content">
        <LoginForm />
      </div>
    </div>
  );
}

export default App;
