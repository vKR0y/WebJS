import React, { useState, useEffect } from "react";
import { logout, getSystemInfo } from "../api/auth";
import BackgroundCanvas from "./BackgroundCanvas";
import "../styles/Dashboard.css";

interface User {
  id: number;
  username: string;
  is_admin: boolean;
  must_change_password: boolean;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "settings">("overview");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [systemLoading, setSystemLoading] = useState(true);
  
  // Kategóriák összecsukhatósága
  const [expandedCategories, setExpandedCategories] = useState({
    server: true,
    hardware: true,
    users: true,
    network: false,
    system: false
  });

  const toggleCategory = (category: keyof typeof expandedCategories) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // System info betöltése
  useEffect(() => {
    const loadSystemInfo = async () => {
      try {
        const data = await getSystemInfo();
        setSystemInfo(data);
      } catch (error) {
        console.error("System info hiba:", error);
      } finally {
        setSystemLoading(false);
      }
    };

    loadSystemInfo();
    
    // 30 másodpercenként frissítés
    const interval = setInterval(loadSystemInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      // Akkor is kijelentkeztetjük, ha a backend hívás sikertelen
      onLogout();
    }
  };

  return (
    <div className="dashboard">
      <BackgroundCanvas />
      <div className="dashboard-overlay">
        {/* Header */}
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
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "..." : "Kijelentkezés"}
            </button>
          </div>
        </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Áttekintés
        </button>
        {user.is_admin && (
          <button 
            className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Felhasználók
          </button>
        )}
        <button 
          className={`nav-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Beállítások
        </button>
      </nav>

      {/* Content */}
      <main className="dashboard-content">
        {activeTab === "overview" && (
          <div className="tab-content">
            <h2>📈 Rendszer áttekintés</h2>
            
            {systemLoading ? (
              <div className="loading-state">⏳ Rendszer információ betöltése...</div>
            ) : (
              <div className="dashboard-categories">
                
                {/* Szerver kategória */}
                <div className="category-section">
                  <div 
                    className="category-header" 
                    onClick={() => toggleCategory('server')}
                  >
                    <h3>🖥️ Szerver állapot</h3>
                    <span className={`category-toggle ${expandedCategories.server ? 'expanded' : ''}`}>
                      {expandedCategories.server ? '▼' : '▶'}
                    </span>
                  </div>
                  {expandedCategories.server && (
                    <div className="category-content">
                      <div className="stats-grid">
                        {/* Szerver állapot */}
                        <div className="stat-card server-status">
                          <h3>🟢 Backend állapot</h3>
                          <p className="stat-value">Működik</p>
                          <p className="stat-desc">FastAPI backend elérhető</p>
                          <div className="status-details">
                            <span>🐍 Python {systemInfo?.system?.python_version}</span>
                            <span>💻 {systemInfo?.system?.platform}</span>
                          </div>
                        </div>

                        {/* API Endpoints */}
                        <div className="stat-card">
                          <h3>🔌 API Végpontok</h3>
                          <p className="stat-value">✅ Működik</p>
                          <p className="stat-desc">Összes endpoint elérhető</p>
                          <div className="api-status-list">
                            {systemInfo?.api_endpoints && Object.entries(systemInfo.api_endpoints).map(([key, status]: [string, any]) => (
                              <div key={key} className="api-endpoint">
                                <span className="endpoint-name">{key.replace(/_/g, ' ')}</span>
                                <span className="endpoint-status">{status}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rendszer idő */}
                        <div className="stat-card">
                          <h3>🕐 Szerver idő</h3>
                          <p className="stat-value">{new Date().toLocaleTimeString("hu-HU")}</p>
                          <p className="stat-desc">{new Date().toLocaleDateString("hu-HU")}</p>
                          <div className="status-details">
                            <span>⏱️ Uptime: {systemInfo?.system?.uptime_hours?.toFixed(1) || 0}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hardver kategória */}
                <div className="category-section">
                  <div 
                    className="category-header" 
                    onClick={() => toggleCategory('hardware')}
                  >
                    <h3>⚙️ Hardver erőforrások</h3>
                    <span className={`category-toggle ${expandedCategories.hardware ? 'expanded' : ''}`}>
                      {expandedCategories.hardware ? '▼' : '▶'}
                    </span>
                  </div>
                  {expandedCategories.hardware && (
                    <div className="category-content">
                      <div className="stats-grid">
                        {/* CPU használat */}
                        <div className="stat-card">
                          <h3>⚡ CPU használat</h3>
                          <p className="stat-value">{systemInfo?.cpu?.usage_percent?.toFixed(1) || 0}%</p>
                          <p className="stat-desc">
                            {systemInfo?.cpu?.cores || 0} mag
                            {systemInfo?.cpu?.frequency_mhz && ` • ${Math.round(systemInfo.cpu.frequency_mhz)} MHz`}
                          </p>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${(systemInfo?.cpu?.usage_percent || 0) > 80 ? 'high' : (systemInfo?.cpu?.usage_percent || 0) > 50 ? 'medium' : 'low'}`}
                              style={{ width: `${systemInfo?.cpu?.usage_percent || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Memória használat */}
                        <div className="stat-card">
                          <h3>🧠 Memória használat</h3>
                          <p className="stat-value">{systemInfo?.memory?.usage_percent?.toFixed(1) || 0}%</p>
                          <p className="stat-desc">
                            {systemInfo?.memory?.used_gb?.toFixed(1) || 0} / {systemInfo?.memory?.total_gb?.toFixed(1) || 0} GB
                            <br />
                            <small>Szabad: {systemInfo?.memory?.available_gb?.toFixed(1) || 0} GB</small>
                          </p>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${(systemInfo?.memory?.usage_percent || 0) > 80 ? 'high' : (systemInfo?.memory?.usage_percent || 0) > 60 ? 'medium' : 'low'}`}
                              style={{ width: `${systemInfo?.memory?.usage_percent || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Disk használat */}
                        <div className="stat-card">
                          <h3>💾 Tárhely használat</h3>
                          <p className="stat-value">{systemInfo?.disk?.usage_percent?.toFixed(1) || 0}%</p>
                          <p className="stat-desc">
                            {systemInfo?.disk?.used_gb?.toFixed(1) || 0} / {systemInfo?.disk?.total_gb?.toFixed(1) || 0} GB
                            <br />
                            <small>Szabad: {systemInfo?.disk?.free_gb?.toFixed(1) || 0} GB</small>
                          </p>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${(systemInfo?.disk?.usage_percent || 0) > 90 ? 'high' : (systemInfo?.disk?.usage_percent || 0) > 70 ? 'medium' : 'low'}`}
                              style={{ width: `${systemInfo?.disk?.usage_percent || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Folyamatok */}
                        <div className="stat-card">
                          <h3>🔄 Rendszer folyamatok</h3>
                          <p className="stat-value">{systemInfo?.processes?.count || 0}</p>
                          <p className="stat-desc">Futó folyamatok száma</p>
                          <div className="status-details">
                            <span>📊 Aktív: {systemInfo?.processes?.count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Felhasználók kategória */}
                <div className="category-section">
                  <div 
                    className="category-header" 
                    onClick={() => toggleCategory('users')}
                  >
                    <h3>👥 Bejelentkezett felhasználók</h3>
                    <span className={`category-toggle ${expandedCategories.users ? 'expanded' : ''}`}>
                      {expandedCategories.users ? '▼' : '▶'}
                    </span>
                  </div>
                  {expandedCategories.users && (
                    <div className="category-content">
                      <div className="stats-grid">
                        {/* Aktív felhasználó */}
                        <div className="stat-card">
                          <h3>👤 Aktív felhasználó</h3>
                          <p className="stat-value">{user.username}</p>
                          <p className="stat-desc">Bejelentkezve</p>
                          <div className="status-details">
                            <span>{user.is_admin ? "🔑 Admin jogok" : "👁️ Alap jogok"}</span>
                          </div>
                        </div>

                        {/* Összes felhasználó (placeholder) */}
                        <div className="stat-card">
                          <h3>📊 Felhasználók összesen</h3>
                          <p className="stat-value">1</p>
                          <p className="stat-desc">Regisztrált felhasználók</p>
                          <div className="status-details">
                            <span>🔑 Admin: 1</span>
                            <span>👁️ Normál: 0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hálózat kategória */}
                <div className="category-section">
                  <div 
                    className="category-header" 
                    onClick={() => toggleCategory('network')}
                  >
                    <h3>🌐 Hálózat & kommunikáció</h3>
                    <span className={`category-toggle ${expandedCategories.network ? 'expanded' : ''}`}>
                      {expandedCategories.network ? '▼' : '▶'}
                    </span>
                  </div>
                  {expandedCategories.network && (
                    <div className="category-content">
                      <div className="stats-grid">
                        {/* Hálózat */}
                        <div className="stat-card">
                          <h3>🌐 Hálózati forgalom</h3>
                          <p className="stat-value">🟢 Aktív</p>
                          <p className="stat-desc">Adatforgalom statisztika</p>
                          <div className="network-stats">
                            <div className="network-item">
                              <span>📤 Küldött:</span>
                              <span>{systemInfo?.network?.bytes_sent ? (systemInfo.network.bytes_sent / (1024**3)).toFixed(2) + ' GB' : '0 GB'}</span>
                            </div>
                            <div className="network-item">
                              <span>📥 Fogadott:</span>
                              <span>{systemInfo?.network?.bytes_recv ? (systemInfo.network.bytes_recv / (1024**3)).toFixed(2) + ' GB' : '0 GB'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rendszer információ kategória */}
                <div className="category-section">
                  <div 
                    className="category-header" 
                    onClick={() => toggleCategory('system')}
                  >
                    <h3>🖥️ Részletes rendszer információ</h3>
                    <span className={`category-toggle ${expandedCategories.system ? 'expanded' : ''}`}>
                      {expandedCategories.system ? '▼' : '▶'}
                    </span>
                  </div>
                  {expandedCategories.system && (
                    <div className="category-content">
                      <div className="stats-grid">
                        {/* Rendszer info */}
                        <div className="stat-card system-info-card">
                          <h3>🖥️ Rendszer információ</h3>
                          <div className="system-details">
                            <div className="detail-item">
                              <span className="label">Hostname:</span>
                              <span className="value">{systemInfo?.system?.hostname || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Platform:</span>
                              <span className="value">{systemInfo?.system?.platform || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Architektúra:</span>
                              <span className="value">{systemInfo?.system?.architecture || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Processzor:</span>
                              <span className="value">{systemInfo?.system?.processor?.substring(0, 30) || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Boot idő:</span>
                              <span className="value">{systemInfo?.system?.boot_time || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Frissítve:</span>
                              <span className="value">{systemInfo?.timestamp ? new Date(systemInfo.timestamp).toLocaleTimeString("hu-HU") : new Date().toLocaleTimeString("hu-HU")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {activeTab === "users" && user.is_admin && (
          <div className="tab-content">
            <h2>👥 Felhasználók kezelése</h2>
            <div className="users-section">
              <div className="section-header">
                <h3>Regisztrált felhasználók</h3>
                <button className="btn-primary">➕ Új felhasználó</button>
              </div>
              <div className="users-list">
                <div className="user-item">
                  <div className="user-info">
                    <span className="user-name">admin</span>
                    <span className="user-role">Administrator</span>
                  </div>
                  <div className="user-actions">
                    <button className="btn-secondary">✏️ Szerkesztés</button>
                    <button className="btn-danger">🗑️ Törlés</button>
                  </div>
                </div>
                <div className="empty-state">
                  <p>💡 Itt jelennek meg a további felhasználók...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="tab-content">
            <h2>⚙️ Beállítások</h2>
            <div className="settings-section">
              <div className="setting-group">
                <h3>🔒 Biztonsági beállítások</h3>
                <div className="setting-item">
                  <label>Jelszó automatikus lejárata (nap)</label>
                  <input type="number" defaultValue="90" />
                </div>
                <div className="setting-item">
                  <label>Maximum bejelentkezési kísérletek</label>
                  <input type="number" defaultValue="5" />
                </div>
              </div>
              
              <div className="setting-group">
                <h3>🎨 Megjelenés</h3>
                <div className="setting-item">
                  <label>Sötét mód</label>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>

              <button className="btn-primary">💾 Beállítások mentése</button>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
};

export default Dashboard;
