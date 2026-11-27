import { create } from "zustand";

export interface NotificationItem {
  id: number;
  type: "order_created" | "order_status" | "promotion";
  referenceId: number | null;
  details: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  isLoaded: boolean;
  fetchInitialNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  isLoaded: false,

  fetchInitialNotifications: async () => {
    const response = await fetch("/api/user/notifications", {
      cache: "no-store",
    });
    if (response.status === 401) {
      set({ notifications: [], isLoaded: true });
      return;
    }
    if (!response.ok) throw new Error("NOTIFICATIONS_FAILED");

    const result = (await response.json()) as {
      notifications: NotificationItem[];
    };
    set({ notifications: result.notifications, isLoaded: true });
  },

  markAllAsRead: async () => {
    const response = await fetch("/api/user/notifications", {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("NOTIFICATIONS_FAILED");
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    }));
  },

  clearNotifications: () =>
    set({ notifications: [], isLoaded: false }),
}));
