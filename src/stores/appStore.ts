import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, BackgroundTheme, VisualFilters, Notification } from "@/types";
import { BACKGROUND_THEMES, MOCK_NOTIFICATIONS } from "@/constants";

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
  
  visualFilters: VisualFilters;
  setVisualFilters: (filters: Partial<VisualFilters>) => void;
  
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  isBgManagerOpen: boolean;
  setBgManagerOpen: (open: boolean) => void;
  
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  setRightSidebarOpen: (open: boolean) => void;
  
  fabOpen: boolean;
  setFabOpen: (open: boolean) => void;
  
  featureFlags: Record<string, boolean>;
  toggleFeatureFlag: (key: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      backgroundTheme: BACKGROUND_THEMES[0],
      setBackgroundTheme: (theme) => set({ backgroundTheme: theme }),

      visualFilters: {
        enabled: true,
        glassIntensity: 80,
        blurLevel: 20,
        tintOpacity: 50,
        neonGlow: 70,
        colorTint: "#00d4ff",
      },
      setVisualFilters: (filters) =>
        set((state) => ({ visualFilters: { ...state.visualFilters, ...filters } })),

      notifications: MOCK_NOTIFICATIONS,
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      isBgManagerOpen: false,
      setBgManagerOpen: (open) => set({ isBgManagerOpen: open }),

      leftSidebarOpen: false,
      rightSidebarOpen: false,
      setLeftSidebarOpen: (open) => set({ leftSidebarOpen: open }),
      setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),

      fabOpen: false,
      setFabOpen: (open) => set({ fabOpen: open }),

      featureFlags: {
        drafts: true,
        notifications: true,
        biometric: false,
        twoFA: true,
        campaigns: false,
        analytics: true,
      },
      toggleFeatureFlag: (key) =>
        set((state) => ({
          featureFlags: { ...state.featureFlags, [key]: !state.featureFlags[key] },
        })),
    }),
    {
      name: "iqmail-store",
      partialize: (state) => ({
        backgroundTheme: state.backgroundTheme,
        visualFilters: state.visualFilters,
        featureFlags: state.featureFlags,
      }),
    }
  )
);
