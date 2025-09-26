// ============================================================================
// INFO ITEM - Clean Code: Reusable Data Display Component
// ============================================================================

import React from 'react';

interface InfoItemProps {
  label: string;
  value: string | number;
  formatter?: (value: string | number) => string;
}

export const InfoItem: React.FC<InfoItemProps> = ({ 
  label, 
  value, 
  formatter 
}) => {
  const displayValue = formatter ? formatter(value) : String(value);
  
  return (
    <div className="info-item">
      <span className="label">{label}:</span>
      <span className="value">{displayValue}</span>
    </div>
  );
};