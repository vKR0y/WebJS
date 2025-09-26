// ============================================================================
// TAB NAVIGATION - Clean Code: Focused Navigation Component
// ============================================================================

import React from 'react';
import { DashboardTab } from '../../types';

interface TabNavigationProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs: { key: DashboardTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Áttekintés', icon: '📊' },
    { key: 'users', label: 'Felhasználók', icon: '👥' },
    { key: 'settings', label: 'Beállítások', icon: '⚙️' }
  ];

  return (
    <nav className="dashboard-nav">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`nav-btn ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => onTabChange(tab.key)}
          aria-selected={activeTab === tab.key}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
};