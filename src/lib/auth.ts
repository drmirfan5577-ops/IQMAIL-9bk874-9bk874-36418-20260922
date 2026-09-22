import { MOCK_USER } from "@/constants";
import type { User } from "@/types";

const USER_KEY = "iqmail_user";
const SESSION_KEY = "iqmail_session";
const FAILED_ATTEMPTS_KEY = "iqmail_failed_attempts";
const LOCKOUT_KEY = "iqmail_lockout_until";
const LAST_ACTIVITY_KEY = "iqmail_last_activity";

export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function getStoredUser(): User | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function isAuthenticated(): boolean {
  const user = getStoredUser();
  if (!user) return false;
  
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (lastActivity) {
    const elapsed = Date.now() - parseInt(lastActivity);
    if (elapsed > SESSION_TIMEOUT_MS) {
      clearStoredUser();
      return false;
    }
  }
  updateLastActivity();
  return true;
}

export function updateLastActivity(): void {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

export function isLockedOut(): boolean {
  const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
  if (!lockoutUntil) return false;
  if (Date.now() < parseInt(lockoutUntil)) return true;
  localStorage.removeItem(LOCKOUT_KEY);
  localStorage.removeItem(FAILED_ATTEMPTS_KEY);
  return false;
}

export function getLockoutTimeRemaining(): number {
  const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
  if (!lockoutUntil) return 0;
  return Math.max(0, parseInt(lockoutUntil) - Date.now());
}

export function recordFailedAttempt(): number {
  const current = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || "0");
  const newCount = current + 1;
  localStorage.setItem(FAILED_ATTEMPTS_KEY, newCount.toString());
  
  if (newCount >= MAX_FAILED_ATTEMPTS) {
    localStorage.setItem(LOCKOUT_KEY, (Date.now() + LOCKOUT_DURATION_MS).toString());
  }
  return newCount;
}

export function clearFailedAttempts(): void {
  localStorage.removeItem(FAILED_ATTEMPTS_KEY);
  localStorage.removeItem(LOCKOUT_KEY);
}

export function getFailedAttempts(): number {
  return parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || "0");
}

export function mockLogin(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (isLockedOut()) {
    const remaining = Math.ceil(getLockoutTimeRemaining() / 60000);
    return { success: false, error: `Account locked. Try again in ${remaining} minutes.` };
  }

  // Mock credentials: any email + password length >= 6
  if (!email.includes("@") || password.length < 6) {
    const attempts = recordFailedAttempt();
    const remaining = MAX_FAILED_ATTEMPTS - attempts;
    if (remaining <= 0) {
      return { success: false, error: "Account locked due to too many failed attempts." };
    }
    return { success: false, error: `Invalid credentials. ${remaining} attempt(s) remaining.` };
  }

  clearFailedAttempts();
  const user: User = {
    ...MOCK_USER,
    email,
    name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
  };
  setStoredUser(user);
  updateLastActivity();
  return { success: true, user };
}

export function mockLogout(): void {
  clearStoredUser();
}

export function checkPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Very Weak", color: "#ef4444" };
  if (score === 2) return { score, label: "Weak", color: "#f97316" };
  if (score === 3) return { score, label: "Fair", color: "#eab308" };
  if (score === 4) return { score, label: "Strong", color: "#22c55e" };
  return { score, label: "Very Strong", color: "#00d4ff" };
}

export function isAdminUser(user: User): boolean {
  return user.role === "admin";
}

export function promoteToAdmin(user: User): User {
  const adminUser = { ...user, role: "admin" as const };
  setStoredUser(adminUser);
  return adminUser;
}
