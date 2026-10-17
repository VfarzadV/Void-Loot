"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Hexagon,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const t = useTranslations("register");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const registerAccount = useAuthStore((state) => state.registerAccount);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("toastInvalidEmail"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("toastShortPassword"));
      return;
    }

    setIsRegistering(true);

    setTimeout(() => {
      registerAccount({
        name: username,
        username: username,
        email: email,
        password: password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        level: 1,
      });

      setIsRegistering(false);
      toast.success(t("toastSuccess"));
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-6 overflow-hidden bg-base-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
          alt="Register Background"
          fill
          unoptimized
          className="object-cover opacity-20 object-center"
        />
        <div className="absolute inset-0 bg-base-950/70 backdrop-blur-md"></div>
        <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-base-950/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-6 group">
          <Hexagon
            className="text-primary-500 group-hover:rotate-90 transition-transform duration-500"
            size={32}
            strokeWidth={2.5}
          />
          <span className="text-2xl font-black tracking-tighter text-white">
            Void<span className="text-primary-500">Loot</span>
          </span>
        </Link>

        <div className="w-full glass-panel bg-base-950/70 p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex flex-col text-center mb-6">
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-base-400">
              {t("subtitle")}
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-username"
                className="text-[10px] font-bold text-base-300 uppercase tracking-wider ms-1"
              >
                {t("usernameLabel")}
              </label>
              <div className="relative group">
                <User
                  size={16}
                  className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
                />
                <input
                  id="register-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("usernamePlaceholder")}
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 ps-11 pe-4 text-sm text-white focus:border-primary-500 focus:bg-base-900 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-email"
                className="text-[10px] font-bold text-base-300 uppercase tracking-wider ms-1"
              >
                {t("emailLabel")}
              </label>
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
                />
                <input
                  id="register-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 ps-11 pe-4 text-sm text-white focus:border-primary-500 focus:bg-base-900 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-password"
                className="text-[10px] font-bold text-base-300 uppercase tracking-wider ms-1"
              >
                {t("passwordLabel")}
              </label>
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
                />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 ps-11 pe-12 text-sm text-white focus:border-primary-500 focus:bg-base-900 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-base-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={isRegistering}
              className="group relative w-full flex justify-center py-3.5 px-4 mt-4 border border-transparent text-sm font-black rounded-xl text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isRegistering ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />{" "}
                    {t("creatingAccount")}
                  </>
                ) : (
                  <>
                    {t("submitBtn")}{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform"
                    />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
            <span className="text-sm text-base-400">
              {t("alreadyMember")}
            </span>
            <Link
              href="/login"
              className="text-sm font-bold text-white hover:text-primary-400 transition-colors"
            >
              {t("signInHere")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}