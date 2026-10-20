import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  items: string;
}

export interface UserStats {
  cloudHours: number;
  gamesOwned: number;
  achievements: number;
}

export interface User {
  name: string;
  username: string;
  email: string;
  password?: string;
  avatar: string;
  banner?: string;
  level: number;
  joinDate?: string;
  stats?: UserStats;
  orders?: Order[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registeredAccount: User | null;
  login: (userData?: User) => void;
  logout: () => void;
  registerAccount: (userData: User) => void;
  updateProfile: (updates: Partial<User>) => void;
  addOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      registeredAccount: null,

      login: (userData) =>
        set({
          user: userData || {
            name: "Shadow Hunter",
            username: "ShadowHunter99",
            email: "demo@voidloot.com",
            avatar: "https://i.pravatar.cc/150?u=farzad",
            banner:
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
            level: 42,
            joinDate: "Oct 2023",
            stats: { cloudHours: 124, gamesOwned: 45, achievements: 312 },
            orders: [],
          },
          isAuthenticated: true,
        }),

      logout: () => set({ user: null, isAuthenticated: false }),

      registerAccount: (userData) =>
        set({
          registeredAccount: {
            ...userData,
            joinDate: new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            stats: { cloudHours: 0, gamesOwned: 0, achievements: 0 },
            orders: [],
          },
        }),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
          registeredAccount: state.registeredAccount
            ? { ...state.registeredAccount, ...updates }
            : null,
        })),

      addOrder: (order) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                orders: [order, ...(state.user.orders || [])],
              }
            : null,
        })),
    }),
    {
      name: "void-auth-storage",
    }
  )
);