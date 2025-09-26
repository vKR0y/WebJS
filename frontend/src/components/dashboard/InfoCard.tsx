// ============================================================================
// INFO CARD - Clean Code: Simple, Reusable Component
// ============================================================================

import React from 'react';

interface InfoCardProps {
  title: string;
  icon?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children
}) => {
  return (
    <div className="info-card">
      <div className="card-header" onClick={onToggle}>
        <h3>
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ▶
          </span>
          {icon && <span className="card-icon">{icon}</span>}
          {title}
        </h3>
      </div>
      {isExpanded && (
        <div className="card-content">
          {children}
        </div>
      )}
    </div>
  );
};