import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  items: string;
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  banner?: string;
  joinDate?: string;
  stats?: {
    gamesOwned: number;
    cloudHours: number;
    achievements: number;
  };
  orders?: Order[];
}

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  registeredAccount: (UserProfile & { password?: string }) | null;
  registerAccount: (account: UserProfile & { password?: string }) => void;
  login: (userData?: UserProfile) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const SAFE_BANNER =
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop";

const DEMO_USER: UserProfile = {
  name: "Farzad",
  username: "ShadowHunter99",
  email: "demo@voidloot.com",
  avatar: "https://i.pravatar.cc/150?u=farzad",
  level: 42,
  banner: SAFE_BANNER,
  joinDate: "October 2026",
  stats: {
    gamesOwned: 124,
    cloudHours: 342,
    achievements: 1056,
  },
  orders: [
    {
      id: "ORD-992-FX",
      date: "Oct 10, 2026",
      status: "Delivered",
      total: "$129.99",
      items: "DualSense Edge Controller",
    },
  ],
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      registeredAccount: null,

      registerAccount: (account) =>
        set({
          registeredAccount: {
            ...account,
            banner: SAFE_BANNER, 
            joinDate: "Just Now",
            stats: { gamesOwned: 0, cloudHours: 0, achievements: 0 },
            orders: [],
          },
        }),

      login: (userData) =>
        set({ user: userData || DEMO_USER, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      addOrder: (order) =>
        set((state) => {
          if (!state.user) return state;
          const updatedUser = {
            ...state.user,
            orders: [order, ...(state.user.orders || [])],
          };

          let updatedRegisteredAccount = state.registeredAccount;
          if (state.registeredAccount?.email === state.user.email) {
            updatedRegisteredAccount = {
              ...state.registeredAccount,
              orders: [order, ...(state.registeredAccount.orders || [])],
            };
          }
          return {
            user: updatedUser,
            registeredAccount: updatedRegisteredAccount,
          };
        }),

      updateProfile: (updates) =>
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...updates };

          let updatedRegisteredAccount = state.registeredAccount;
          if (state.registeredAccount?.email === state.user.email) {
            updatedRegisteredAccount = {
              ...state.registeredAccount,
              ...updates,
            };
          }
          return {
            user: updatedUser,
            registeredAccount: updatedRegisteredAccount,
          };
        }),
    }),
    {
      name: "void-loot-auth",
    },
  ),
);
