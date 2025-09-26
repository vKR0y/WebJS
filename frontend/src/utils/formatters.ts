// ============================================================================
// FORMAT UTILITIES - Clean Code: DRY Principle
// ============================================================================

/**
 * Formats seconds to human readable uptime string
 * @param seconds - Uptime in seconds
 * @returns Formatted string (e.g., "2d 5h 30m")
 */
export const formatUptime = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0m';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Formats bytes to human readable size string
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.25 GB")
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Formats percentage with specified decimal places
 * @param value - Percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (value == null || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Gets CSS class for progress bar based on percentage
 * @param percentage - Current percentage
 * @param highThreshold - Threshold for "high" class (default: 80)
 * @param mediumThreshold - Threshold for "medium" class (default: 60)
 * @returns CSS class name
 */
export const getProgressBarClass = (
  percentage: number, 
  highThreshold: number = 80, 
  mediumThreshold: number = 60
): string => {
  if (percentage >= highThreshold) return 'high';
  if (percentage >= mediumThreshold) return 'medium';
  return 'low';
};