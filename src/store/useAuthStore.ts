import { create } from "zustand";

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
  id: number;
  name: string;
  username: string;
  email: string;
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
  isLoading: boolean;
  initialize: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: (user) =>
    set({ user, isAuthenticated: user !== null, isLoading: false }),

  login: (userData) =>
    set({ user: userData, isAuthenticated: true, isLoading: false }),

  logout: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  addOrder: (order) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, orders: [order, ...(state.user.orders || [])] }
        : null,
    })),
}));