// ============================================================================
// SYSTEM OVERVIEW - Clean Code: Dedicated Overview Component with Original CSS
// ============================================================================

import React from 'react';
import { SystemInfo, ExpandableCategories } from '../../types';
import { formatUptime, formatBytes, formatPercentage } from '../../utils/formatters';

interface SystemOverviewProps {
  systemInfo: SystemInfo | null;
  isLoading: boolean;
  error: string | null;
  expandedCategories: ExpandableCategories;
  onToggleCategory: (category: keyof ExpandableCategories) => void;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({
  systemInfo,
  isLoading,
  error,
  expandedCategories,
  onToggleCategory
}) => {
  if (error) {
    return (
      <div className="tab-content">
        <div className="error-message">
          <h3>❌ Hiba a rendszer információk betöltésében</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h2>📈 Rendszer áttekintés</h2>
      
      {isLoading ? (
        <div className="loading-state">⏳ Rendszer információ betöltése...</div>
      ) : (
        <div className="dashboard-categories">
          
          {/* Szerver kategória */}
          <div className="category-section">
            <div 
              className="category-header" 
              onClick={() => onToggleCategory('server')}
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

                  {/* Rendszer idő */}
                  <div className="stat-card">
                    <h3>🕐 Szerver idő</h3>
                    <p className="stat-value">{systemInfo?.timestamp ? new Date(systemInfo.timestamp).toLocaleTimeString("hu-HU") : new Date().toLocaleTimeString("hu-HU")}</p>
                    <p className="stat-desc">{new Date().toLocaleDateString("hu-HU")}</p>
                    <div className="status-details">
                      <span>⏱️ Uptime: {systemInfo?.system?.uptime_hours ? `${systemInfo.system.uptime_hours.toFixed(1)}h` : 'N/A'}</span>
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
              onClick={() => onToggleCategory('hardware')}
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
                    <p className="stat-value">{formatPercentage(systemInfo?.cpu?.usage_percent || 0)}</p>
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
                    <p className="stat-value">{formatPercentage(systemInfo?.memory?.usage_percent || 0)}</p>
                    <p className="stat-desc">
                      {systemInfo?.memory?.used_gb?.toFixed(1) || '0'} / {systemInfo?.memory?.total_gb?.toFixed(1) || '0'} GB
                      <br />
                      <small>Szabad: {systemInfo?.memory?.available_gb?.toFixed(1) || '0'} GB</small>
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
                    <p className="stat-value">{formatPercentage(systemInfo?.disk?.usage_percent || 0)}</p>
                    <p className="stat-desc">
                      {systemInfo?.disk?.used_gb?.toFixed(1) || '0'} / {systemInfo?.disk?.total_gb?.toFixed(1) || '0'} GB
                      <br />
                      <small>Szabad: {systemInfo?.disk?.free_gb?.toFixed(1) || '0'} GB</small>
                    </p>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${(systemInfo?.disk?.usage_percent || 0) > 90 ? 'high' : (systemInfo?.disk?.usage_percent || 0) > 70 ? 'medium' : 'low'}`}
                        style={{ width: `${systemInfo?.disk?.usage_percent || 0}%` }}
                      ></div>
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
              onClick={() => onToggleCategory('network')}
            >
              <h3>🌐 Hálózat & kommunikáció</h3>
              <span className={`category-toggle ${expandedCategories.network ? 'expanded' : ''}`}>
                {expandedCategories.network ? '▼' : '▶'}
              </span>
            </div>
            {expandedCategories.network && (
              <div className="category-content">
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>🌐 Hálózati forgalom</h3>
                    <p className="stat-value">🟢 Aktív</p>
                    <p className="stat-desc">Adatforgalom statisztika</p>
                    <div className="network-stats">
                      <div className="network-item">
                        <span>📤 Küldött:</span>
                        <span>{systemInfo?.network?.bytes_sent ? formatBytes(systemInfo.network.bytes_sent) : '0 B'}</span>
                      </div>
                      <div className="network-item">
                        <span>📥 Fogadott:</span>
                        <span>{systemInfo?.network?.bytes_recv ? formatBytes(systemInfo.network.bytes_recv) : '0 B'}</span>
                      </div>
                      <div className="network-item">
                        <span>� Hostname:</span>
                        <span>{systemInfo?.system?.hostname || 'N/A'}</span>
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
              onClick={() => onToggleCategory('system')}
            >
              <h3>🖥️ Részletes rendszer információ</h3>
              <span className={`category-toggle ${expandedCategories.system ? 'expanded' : ''}`}>
                {expandedCategories.system ? '▼' : '▶'}
              </span>
            </div>
            {expandedCategories.system && (
              <div className="category-content">
                <div className="stats-grid">
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
  );
};