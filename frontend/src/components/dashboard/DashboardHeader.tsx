// ============================================================================
// DASHBOARD HEADER - Clean Code: Single Responsibility Component
// ============================================================================

import React from 'react';
import { User } from '../../types';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  user, 
  onLogout, 
  isLoggingOut 
}) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>🚀 WebJS Admin</h1>
        <span className="version">v1.0</span>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span className="username">👤 {user.username}</span>
          {user.is_admin && <span className="admin-badge">ADMIN</span>}
        </div>
        <button 
          className="logout-btn" 
          onClick={onLogout}
          disabled={isLoggingOut}
          aria-label="Kijelentkezés"
        >
          {isLoggingOut ? "..." : "Kijelentkezés"}
        </button>
      </div>
    </header>
  );
};