"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ShoppingCart,
  Search,
  Bell,
  X,
  Package,
  Tag,
  ShieldAlert,
  Info,
  CheckCheck,
  LogOut,
  User,
  Clock,
  Trash2,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { toast } from "sonner";

const ICON_MAP = {
  Package,
  Tag,
  ShieldAlert,
  Info,
};

export default function Navbar() {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();

  const { toggleCart, items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { recentSearches, addSearch, removeSearch, clearSearches } =
    useSearchStore();
  const { notifications, fetchInitialNotifications, markAllAsRead } =
    useNotificationStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    fetchInitialNotifications();
    return () => clearTimeout(timer);
  }, [fetchInitialNotifications]);

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
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      )
        setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, queryOverride?: string) => {
    if (e) e.preventDefault();
    const finalQuery = queryOverride || searchQuery;

    if (finalQuery.trim()) {
      addSearch(finalQuery.trim());
      const currentLocale = pathname.startsWith("/fa") ? "fa" : "en";
      router.push(
        `/${currentLocale}/games?search=${encodeURIComponent(finalQuery.trim())}`,
      );
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
      <div className="flex items-center gap-4">
        <button className="md:hidden text-base-400 hover:text-white">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-base-50 flex items-center gap-1 group"
        >
          Void
          <span className="text-primary-500 drop-shadow-[0_0_10px_rgba(170,79,255,0.5)] group-hover:text-primary-400 transition-colors">
            Loot
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className="relative  items-center hidden sm:flex"
          ref={searchContainerRef}
        >
          <form
            onSubmit={handleSearchSubmit}
            className={`relative flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              isSearchOpen ? "w-64" : "w-10"
            }`}
          >
            <button
              type={isSearchOpen ? "submit" : "button"}
              onClick={(e) => {
                if (!isSearchOpen) {
                  e.preventDefault();
                  setIsSearchOpen(true);
                } else if (!searchQuery.trim()) {
                  e.preventDefault();
                }
              }}
              className={`absolute inset-e-0 z-30 flex items-center justify-center w-10 h-full transition-colors ${
                isSearchOpen
                  ? "text-primary-400 hover:text-primary-300"
                  : "text-base-400 hover:text-white"
              }`}
              title="Search"
            >
              <Search size={20} />
            </button>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tCommon("searchPlaceholder")}
              className={`w-full h-10 bg-base-900/50 border border-primary-500/50 rounded-full pe-10 text-sm text-white focus:outline-none focus:bg-base-900 focus:border-primary-400 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_0_15px_rgba(170,79,255,0.15)] transition-all duration-500 z-20 ${
                isSearchOpen
                  ? "ps-10 opacity-100 pointer-events-auto"
                  : "ps-10 opacity-0 pointer-events-none"
              }`}
            />

            {isSearchOpen && (
              <button
                type="button"
                onClick={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  } else {
                    setIsSearchOpen(false);
                  }
                }}
                className="absolute inset-e-3 z-30 flex items-center justify-center text-base-500 hover:text-rose-400 transition-colors"
              >
                <X size={16} />
              </button>
            )}

            {isSearchOpen && recentSearches.length > 0 && isMounted && (
              <div className="absolute top-full mt-3 inset-x-0 bg-base-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-[10px] font-bold text-base-500 uppercase tracking-widest">
                    Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearSearches}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-base-900/50 transition-colors group"
                    >
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit(undefined, term)}
                        className="flex items-center gap-2 text-sm text-base-300 group-hover:text-white transition-colors grow text-start"
                      >
                        <Clock size={14} className="text-base-500" /> {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSearch(term)}
                        className="text-base-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
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
              <span className="absolute -top-1 -inset-e-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-base-950"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute inset-e-0 top-10 w-80 glass-panel bg-base-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-base-900/30">
                <h3 className="text-sm font-black text-white">
                  {tNav("notifications")}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-wider"
                  >
                    <CheckCheck size={12} /> {tNav("markAllRead")}
                  </button>
                )}
              </div>

              <div className="max-h-75 overflow-y-auto flex flex-col hide-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-base-400">
                    {tNav("noNotifications")}
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon =
                      ICON_MAP[notif.iconName as keyof typeof ICON_MAP] || Info;
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
            <span className="absolute -top-1.5 -inset-e-2 bg-primary-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(170,79,255,0.5)] animate-in zoom-in">
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
              <div className="hidden sm:flex flex-col items-end text-end">
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute inset-e-0 top-12 w-48 glass-panel bg-base-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                <div className="p-2 flex flex-col gap-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-base-300 hover:text-white hover:bg-base-900 rounded-lg transition-colors"
                  >
                    <User size={16} /> {tNav("profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors w-full text-start"
                  >
                    <LogOut size={16} /> {tNav("signOut")}
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
              {tNav("login")}
            </Link>
            <Link
              href="/register"
              className="relative group px-4 py-2 rounded-xl font-bold text-sm text-white overflow-hidden shadow-[0_0_15px_rgba(170,79,255,0.2)] hover:shadow-[0_0_25px_rgba(170,79,255,0.4)] transition-shadow"
            >
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-primary-600 to-primary-400 group-hover:scale-105 transition-transform duration-300"></span>
              <span className="relative z-10">{tNav("signUp")}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
