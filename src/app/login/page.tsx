"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Hexagon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // استیت ورودی‌های لاگین
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { login, registeredAccount } = useAuthStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    setTimeout(() => {
      setIsLoggingIn(false);

      // بررسی اطلاعات با اکانتی که تازه ثبت نام کرده
      if (registeredAccount && email === registeredAccount.email && password === registeredAccount.password) {
        login(registeredAccount);
        toast.success(`Welcome back to the Void, ${registeredAccount.username}!`);
        router.push("/");
      } 
      // فول‌بک به اکانت دمو (اگر کسی ثبت‌نام نکرد و خواست مستقیم لاگین کند)
      else if (email === "demo@voidloot.com" && password === "demo1234") {
        login(); // استفاده از DEMO_USER پیش‌فرض
        toast.success("Demo Login successful! Welcome back, ShadowHunter99.");
        router.push("/");
      } 
      // خطا در صورت اشتباه بودن اطلاعات
      else {
        toast.error("Access Denied: Invalid email or password.");
      }
    }, 1500);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-6 overflow-hidden bg-base-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://media.rawg.io/media/games/26d/26d4437715bee60138cb4a44dbe8bf2f.jpg"
          alt="Login Background"
          fill
          unoptimized
          className="object-cover opacity-30 object-center"
        />
        <div className="absolute inset-0 bg-base-950/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-base-950/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <Hexagon className="text-primary-500 group-hover:rotate-90 transition-transform duration-500" size={36} strokeWidth={2.5} />
          <span className="text-3xl font-black tracking-tighter text-white">
            Void<span className="text-primary-500">Loot</span>
          </span>
        </Link>

        <div className="w-full glass-panel bg-base-950/60 p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex flex-col text-center mb-8">
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-sm text-base-400">Enter your credentials or use <strong className="text-white">demo@voidloot.com</strong> (Pass: demo1234)</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-base-300 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="player@nexus.com"
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-primary-500 focus:bg-base-900 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="login-password" className="text-xs font-bold text-base-300 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 pl-11 pr-12 text-sm text-white focus:border-primary-500 focus:bg-base-900 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoggingIn}
              className="group relative w-full flex justify-center py-3.5 px-4 mt-2 border border-transparent text-sm font-black rounded-xl text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all duration-300 disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoggingIn ? (
                  <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
                ) : (
                  <>Initiate Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm text-base-400">Don&apos;t have an account?</span>
            <Link href="/register" className="text-sm font-bold text-white hover:text-primary-400 transition-colors">Join the Void</Link>
          </div>
        </div>
      </div>
    </div>
  );
}