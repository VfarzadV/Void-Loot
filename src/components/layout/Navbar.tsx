"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Bell,
  X,
  Package,
  Tag,
  ShieldAlert,
  CheckCheck,
  LogOut,
  User,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Order Shipped",
    desc: "Your package #ORD-992 is on the way.",
    time: "2h ago",
    icon: Package,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    unread: true,
  },
  {
    id: 2,
    title: "Flash Sale Alert",
    desc: "Cyberpunk 2077 is 50% off today!",
    time: "5h ago",
    icon: Tag,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    unread: true,
  },
  {
    id: 3,
    title: "Security Notice",
    desc: "New login detected from Windows PC.",
    time: "1d ago",
    icon: ShieldAlert,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    unread: false,
  },
];

export default function Navbar() {
  const { toggleCart, items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node))
        setIsNotifOpen(false);
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      )
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    toast.success("Logged out successfully. See you soon in the Void!");
    router.push("/");
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="w-full h-20 px-6 lg:px-12 flex items-center justify-between z-40 sticky top-0 bg-base-950/80 backdrop-blur-xl border-b border-white/5">
      <Link
        href="/"
        className="text-2xl font-black tracking-tighter text-base-50 flex items-center gap-1 group"
      >
        Void
        <span className="text-primary-500 drop-shadow-[0_0_10px_rgba(170,79,255,0.5)] group-hover:text-primary-400 transition-colors">
          Loot
        </span>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative items-center hidden sm:flex">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${isSearchOpen ? "w-64 opacity-100 mr-2" : "w-0 opacity-0 mr-0"}`}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-base-900/50 border border-primary-500/50 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:bg-base-900 focus:border-primary-400 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_0_15px_rgba(170,79,255,0.15)] transition-all"
            />
            {isSearchOpen && (
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3 text-base-400 hover:text-rose-400 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </form>
          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-base-400 hover:text-white transition-colors"
              title="Search"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        <div className="relative hidden sm:block" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative transition-colors ${isNotifOpen ? "text-white" : "text-base-400 hover:text-white"}`}
          >
            <Bell
              size={20}
              className={`${unreadCount > 0 && !isNotifOpen ? "animate-[ring_4s_ease-in-out_infinite]" : ""}`}
            />
            {isMounted && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-base-950"></span>
            )}
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 top-10 w-80 glass-panel bg-base-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-base-900/30">
                <h3 className="text-sm font-black text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() =>
                      setNotifications(
                        notifications.map((n) => ({ ...n, unread: false })),
                      )
                    }
                    className="flex items-center gap-1 text-[10px] font-bold text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-wider"
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-75 overflow-y-auto flex flex-col hide-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-base-400">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div
                        key={notif.id}
                        className={`flex gap-3 p-4 border-b border-white/5 transition-colors hover:bg-base-900/50 cursor-pointer ${notif.unread ? "bg-primary-900/5" : ""}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex flex-col gap-1 grow">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-bold ${notif.unread ? "text-white" : "text-base-300"}`}
                            >
                              {notif.title}
                            </span>
                            {notif.unread && (
                              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_5px_rgba(170,79,255,0.8)]"></div>
                            )}
                          </div>
                          <p className="text-xs text-base-400 leading-snug">
                            {notif.desc}
                          </p>
                          <span className="text-[10px] text-base-500 font-medium mt-1">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-white/10 hidden sm:block"></div>

        <button
          onClick={toggleCart}
          className="relative text-base-400 hover:text-white transition-colors group"
        >
          <ShoppingCart
            size={22}
            className="group-hover:scale-110 transition-transform"
          />
          {isMounted && totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-primary-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(170,79,255,0.5)] animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </button>

        <div className="w-px h-5 bg-white/10"></div>

        {isMounted && isAuthenticated && user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-white">
                  {user.name}
                </span>
                <span className="text-[10px] text-primary-400 font-mono">
                  LVL {user.level}
                </span>
              </div>
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-primary-500/50 shadow-[0_0_10px_rgba(170,79,255,0.3)]">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-48 glass-panel bg-base-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                <div className="p-2 flex flex-col gap-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-base-300 hover:text-white hover:bg-base-900 rounded-lg transition-colors"
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-bold text-base-300 hover:text-white transition-colors hidden sm:block"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="relative group px-4 py-2 rounded-xl font-bold text-sm text-white overflow-hidden shadow-[0_0_15px_rgba(170,79,255,0.2)] hover:shadow-[0_0_25px_rgba(170,79,255,0.4)] transition-shadow"
            >
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-primary-600 to-primary-400 group-hover:scale-105 transition-transform duration-300"></span>
              <span className="relative z-10">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
