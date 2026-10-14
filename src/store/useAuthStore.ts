import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
}

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  registeredAccount: (UserProfile & { password?: string }) | null; // ذخیره اکانت ثبت‌نامی
  registerAccount: (account: UserProfile & { password?: string }) => void;
  login: (userData?: UserProfile) => void;
  logout: () => void;
}

// دیتای کاربری دمو (برای مواقعی که کاربر با ایمیل دمو وارد می‌شود)
const DEMO_USER: UserProfile = {
  name: "Farzad",
  username: "ShadowHunter99",
  email: "demo@voidloot.com",
  avatar: "https://i.pravatar.cc/150?u=farzad",
  level: 42,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      registeredAccount: null,
      
      // ذخیره اطلاعات فرم ثبت نام
      registerAccount: (account) => set({ registeredAccount: account }),
      
      // ورود به سایت (اگر دیتایی پاس داده نشود، اکانت دمو لود می‌شود)
      login: (userData) => set({ user: userData || DEMO_USER, isAuthenticated: true }),
      
      // خروج از حساب
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "void-loot-auth",
    }
  )
);