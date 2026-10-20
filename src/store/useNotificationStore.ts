import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  iconName: "Package" | "Tag" | "ShieldAlert" | "Info";
  color: string;
  bg: string;
  unread: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  isLoaded: boolean;
  fetchInitialNotifications: () => Promise<void>;
  addNotification: (notif: Omit<NotificationItem, "id" | "time">) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoaded: false,

      fetchInitialNotifications: async () => {
        if (get().isLoaded) return;

        await new Promise((resolve) => setTimeout(resolve, 1500));

        set({
          notifications: [
            {
              id: "1",
              title: "Order Shipped",
              desc: "Your package #ORD-992 is on the way.",
              time: "2h ago",
              iconName: "Package",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              unread: true,
            },
            {
              id: "2",
              title: "Flash Sale Alert",
              desc: "Cyberpunk 2077 is 50% off today!",
              time: "5h ago",
              iconName: "Tag",
              color: "text-rose-400",
              bg: "bg-rose-500/10",
              unread: true,
            },
            {
              id: "3",
              title: "Security Notice",
              desc: "New login detected from Windows PC.",
              time: "1d ago",
              iconName: "ShieldAlert",
              color: "text-amber-400",
              bg: "bg-amber-500/10",
              unread: false,
            },
          ],
          isLoaded: true,
        });
      },

      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: Date.now().toString(),
              time: "Just now",
            },
            ...state.notifications,
          ],
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            unread: false,
          })),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "void-notifications",
      partialize: (state) => ({
        notifications: state.notifications,
        isLoaded: state.isLoaded,
      }),
    },
  ),
);
