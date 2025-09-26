// ============================================================================
// SHARED TYPES - Clean Code: Central type definitions
// ============================================================================

// User related types
export interface User {
  id: number;
  username: string;
  is_admin: boolean;
  must_change_password: boolean;
}

export interface UserProfile extends User {
  email?: string;
  full_name?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  group_id?: number;
  group_name?: string;
}

// System related types - Updated to match backend structure
export interface SystemInfo {
  status: string;
  timestamp: string;
  cpu: {
    usage_percent: number;
    cores: number;
    frequency_mhz?: number;
  };
  memory: {
    total_gb: number;
    used_gb: number;
    available_gb: number;
    usage_percent: number;
  };
  disk: {
    total_gb: number;
    used_gb: number;
    free_gb: number;
    usage_percent: number;
  };
  network: {
    bytes_sent: number;
    bytes_recv: number;
    packets_sent: number;
    packets_recv: number;
  };
  system: {
    platform: string;
    platform_version: string;
    architecture: string;
    processor: string;
    hostname: string;
    python_version: string;
    boot_time: string;
    uptime_hours: number;
  };
  processes: {
    count: number;
  };
  api_endpoints: {
    [key: string]: string;
  };
}

// Component props types
export interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Tab types for dashboard
export type DashboardTab = "overview" | "users" | "settings";

// State types for expandable categories
export interface ExpandableCategories {
  server: boolean;
  hardware: boolean;
  users: boolean;
  network: boolean;
  system: boolean;
}