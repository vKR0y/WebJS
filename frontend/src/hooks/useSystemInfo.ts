// ============================================================================
// SYSTEM INFO HOOK - Clean Code: Single Responsibility
// ============================================================================

import { useState, useEffect } from 'react';
import { getSystemInfo } from '../api/auth';
import { SystemInfo } from '../types';

export const useSystemInfo = (refreshInterval: number = 30000) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSystemInfo = async () => {
      try {
        setError(null);
        const data = await getSystemInfo();
        setSystemInfo(data);
      } catch (err) {
        console.error("System info loading error:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadSystemInfo();
    
    // Set up refresh interval
    const interval = setInterval(loadSystemInfo, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { systemInfo, isLoading, error };
};