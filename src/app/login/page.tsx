"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Hexagon } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <Hexagon
            className="text-primary-500 group-hover:rotate-90 transition-transform duration-500"
            size={36}
            strokeWidth={2.5}
          />
          <span className="text-3xl font-black tracking-tighter text-white">
            Void
            <span className="text-primary-500 drop-shadow-[0_0_10px_rgba(170,79,255,0.5)]">
              Loot
            </span>
          </span>
        </Link>
        <div className="w-full glass-panel bg-base-950/60 p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex flex-col text-center mb-8">
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-base-400">
              Enter your credentials to access your loot.
            </p>
          </div>
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-base-300 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
                />
                <input
                  type="email"
                  placeholder="player@nexus.com"
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-base-600 focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-base-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-base-600 focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
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
            <button className="group relative w-full flex justify-center py-3.5 px-4 mt-2 border border-transparent text-sm font-black rounded-xl text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Initiate Login{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </button>
          </form>
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm text-base-400">
              Don&apos;t have an account?
            </span>
            <Link
              href="/register"
              className="text-sm font-bold text-white hover:text-primary-400 transition-colors"
            >
              Join the Void
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
