export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  verified: boolean;
  twoFAEnabled: boolean;
  biometricEnabled: boolean;
  joinedAt: string;
  lastSeen: string;
  status: 'active' | 'suspended' | 'banned';
}

export interface Email {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  preview: string;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam';
  timestamp: string;
  tags: string[];
  attachments?: { name: string; size: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

export interface BackgroundTheme {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'animated' | 'image';
  value: string;
  preview: string;
}

export interface VisualFilters {
  enabled: boolean;
  glassIntensity: number;
  blurLevel: number;
  tintOpacity: number;
  neonGlow: number;
  colorTint: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalEmails: number;
  bannedUsers: number;
  openRate: string;
  campaigns: number;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected';
  description: string;
  color: string;
}
