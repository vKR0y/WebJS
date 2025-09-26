// ============================================================================
// DASHBOARD - Clean Code: Single Responsibility & Composition
// ============================================================================

import React, { useState } from 'react';
import { User, DashboardTab } from '../types';
import { useSystemInfo } from '../hooks/useSystemInfo';
import { useExpandableCategories } from '../hooks/useExpandableCategories';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { TabNavigation } from './dashboard/TabNavigation';
import { SystemOverview } from './dashboard/SystemOverview';
import BackgroundCanvas from './BackgroundCanvas';
import '../styles/Dashboard.css';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  // ========================================================================
  // STATE MANAGEMENT - Clean separation of concerns
  // ========================================================================
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Custom hooks handle their own logic (SRP)
  const { systemInfo, isLoading, error } = useSystemInfo();
  const { expandedCategories, toggleCategory, expandAll, collapseAll } = useExpandableCategories({
    server: true,
    hardware: true,
    network: true,
    system: true,
    users: true
  });

  // ========================================================================
  // LOGOUT HANDLER - Single responsibility
  // ========================================================================
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ========================================================================
  // TAB CONTENT RENDERER - KISS principle
  // ========================================================================
  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case 'overview':
        return (
          <SystemOverview
            systemInfo={systemInfo}
            isLoading={isLoading}
            error={error}
            expandedCategories={expandedCategories}
            onToggleCategory={toggleCategory}
          />
        );
      
      case 'users':
      case 'settings':
        return (
          <div className="tab-content">
            <h3>{activeTab}</h3>
            <p>Ez a funkció hamarosan elérhető lesz...</p>
          </div>
        );
      
      default:
        return (
          <div className="tab-content">
            <h3>Ismeretlen oldal</h3>
            <p>A kért oldal nem található.</p>
          </div>
        );
    }
  };

  // ========================================================================
  // RENDER - Composition over inheritance
  // ========================================================================
  return (
    <div className="dashboard">
      <BackgroundCanvas />
      <div className="dashboard-overlay">
        <DashboardHeader 
          user={user} 
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="dashboard-content">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
