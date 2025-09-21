import React, { useState } from "react";
import BackgroundCanvas from "./components/BackgroundCanvas";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import "./styles/main.css";

interface User {
  id: number;
  username: string;
  is_admin: boolean;
  must_change_password: boolean;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoggedIn && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div>
      <BackgroundCanvas />
      <div className="centered-content">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

export default App;
