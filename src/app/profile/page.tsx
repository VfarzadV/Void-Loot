"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  Shield,
  Bell,
  LogOut,
  Edit2,
  Gamepad2,
  Cloud,
  Trophy,
  Package,
  ChevronRight,
} from "lucide-react";

const USER_DATA = {
  name: "Farzad",
  username: "ShadowHunter99",
  email: "farzad@voidloot.com",
  level: 42,
  avatar: "https://i.pravatar.cc/150?u=farzad",
  banner:
    "https://media.rawg.io/media/games/26d/26d4437715bee60138cb4a44dbe8bf2f.jpg",
  joinDate: "October 2025",
  stats: {
    gamesOwned: 124,
    cloudHours: 342,
    achievements: 1056,
  },
};

const RECENT_ORDERS = [
  {
    id: "ORD-992-FX",
    date: "Oct 10, 2026",
    status: "Delivered",
    total: "$129.99",
    items: "DualSense Edge Controller",
  },
  {
    id: "ORD-845-TY",
    date: "Sep 28, 2026",
    status: "Completed",
    total: "$59.99",
    items: "Cyberpunk 2077 (Digital)",
  },
  {
    id: "ORD-712-QW",
    date: "Aug 15, 2026",
    status: "Completed",
    total: "$24.50",
    items: "PSN Gift Card $25",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const TABS = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-6 max-w-[1600px] mx-auto overflow-hidden">
      <div className="w-full relative h-48 md:h-64 rounded-3xl overflow-hidden mb-24 border border-white/10 group">
        <Image
          src={USER_DATA.banner}
          alt="Profile Banner"
          fill
          unoptimized
          className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-base-950 via-base-950/40 to-transparent" />
        <button type="button" aria-label="Edit profile banner" className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white hover:bg-primary-600 hover:border-primary-500 transition-all z-10">
          <Edit2 size={16} aria-hidden="true" />
        </button>
        <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6 z-20">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-base-950 bg-base-900 shadow-[0_0_30px_rgba(170,79,255,0.4)] group-hover:border-primary-500/50 transition-colors duration-500">
            <Image
              src={USER_DATA.avatar}
              alt={USER_DATA.name}
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
              <Edit2 size={24} className="text-white" />
            </div>
          </div>
          <div className="mb-18 flex flex-col drop-shadow-lg">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {USER_DATA.name}
              </h1>
              <span className="px-2.5 py-1 rounded-lg bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(170,79,255,0.5)]">
                LVL {USER_DATA.level}
              </span>
            </div>
            <span className="text-sm font-bold text-primary-400">
              @{USER_DATA.username}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-4 flex flex-col gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${
                    isActive
                      ? "bg-primary-500/10 text-primary-400 border border-primary-500/30 shadow-[inset_0_0_15px_rgba(170,79,255,0.1)]"
                      : "text-base-400 hover:bg-base-900 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-primary-400" : "text-base-500"}
                  />
                  {tab.label}
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </button>
              );
            })}
            <div className="w-full h-px bg-white/5 my-2"></div>
            <button type="button" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold text-base-400 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/30">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
          <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-3">
              Account Info
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-base-500">Member Since</span>
                <span className="font-bold text-white">
                  {USER_DATA.joinDate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-500">Plan</span>
                <span className="font-bold text-primary-400">Void Premium</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-9 flex flex-col gap-6">
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 flex items-center gap-4 hover:border-primary-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Cloud size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">
                      {USER_DATA.stats.cloudHours}
                    </span>
                    <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
                      Cloud Hours
                    </span>
                  </div>
                </div>
                <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 flex items-center gap-4 hover:border-primary-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20">
                    <Gamepad2 size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">
                      {USER_DATA.stats.gamesOwned}
                    </span>
                    <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
                      Games Owned
                    </span>
                  </div>
                </div>
                <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 flex items-center gap-4 hover:border-primary-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center border border-yellow-500/20">
                    <Trophy size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">
                      {USER_DATA.stats.achievements}
                    </span>
                    <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
                      Achievements
                    </span>
                  </div>
                </div>
              </div>
              <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Package size={20} className="text-primary-500" /> Recent
                    Activity
                  </h2>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-primary-400 hover:text-primary-300 uppercase tracking-wider"
                  >
                    View All
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {RECENT_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-base-900/30 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-white">
                          {order.items}
                        </span>
                        <span className="text-xs text-base-500 font-mono">
                          {order.id} • {order.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 md:justify-end">
                        <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                          {order.status}
                        </span>
                        <span className="text-base font-black text-white w-16 text-right">
                          {order.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-1 border-b border-white/5 pb-6">
                <h2 className="text-2xl font-black text-white">
                  Account Settings
                </h2>
                <p className="text-sm text-base-400">
                  Manage your personal information and security preferences.
                </p>
              </div>
              <form
                className="flex flex-col gap-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="profile-display-name" className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                      Display Name
                    </label>
                    <input
                      id="profile-display-name"
                      type="text"
                      defaultValue={USER_DATA.name}
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="profile-username" className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                      Gamer Tag (Username)
                    </label>
                    <input
                      id="profile-username"
                      type="text"
                      defaultValue={USER_DATA.username}
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="profile-email" className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                      Email Address
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      defaultValue={USER_DATA.email}
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-white/5 my-2"></div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Shield size={16} className="text-primary-500" /> Security
                  </h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-base-900/30 border border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">
                        Two-Factor Authentication
                      </span>
                      <span className="text-xs text-base-500">
                        Add an extra layer of security to your account.
                      </span>
                    </div>
                    <button type="button" className="px-4 py-2 rounded-lg bg-base-950 border border-white/10 text-xs font-bold text-white hover:border-primary-500 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Bell size={16} className="text-primary-500" />{" "}
                    Notifications
                  </h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-base-900/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">
                        Order Updates
                      </span>
                      <span className="text-xs text-base-500">
                        Receive emails about your order status.
                      </span>
                    </div>
                    <div className="w-10 h-6 rounded-full bg-primary-500 flex items-center justify-end p-1 shadow-[0_0_10px_rgba(170,79,255,0.4)]">
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-base-900/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">
                        Marketing & Promos
                      </span>
                      <span className="text-xs text-base-500">
                        Get emails about new drops and discounts.
                      </span>
                    </div>
                    <div className="w-10 h-6 rounded-full bg-base-800 flex items-center justify-start p-1">
                      <div className="w-4 h-4 rounded-full bg-base-400"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
                  <button type="button" className="px-6 py-3 rounded-xl font-bold text-sm text-base-300 hover:text-white bg-base-900 border border-white/5 hover:bg-base-800 transition-colors">
                    Cancel
                  </button>
                  <button className="px-6 py-3 rounded-xl font-black text-sm text-white bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
          {(activeTab === "orders" || activeTab === "wishlist") && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-12 flex flex-col items-center justify-center gap-4 text-center min-h-100">
              <div className="w-16 h-16 rounded-2xl bg-base-900/50 flex items-center justify-center border border-white/5 text-base-500 mb-2">
                {activeTab === "orders" ? (
                  <Package size={32} />
                ) : (
                  <Heart size={32} />
                )}
              </div>
              <h3 className="text-xl font-black text-white">
                Nothing to see here yet
              </h3>
              <p className="text-sm text-base-400 max-w-sm">
                Your {activeTab} list is currently empty. Explore the store to
                find amazing games and gear.
              </p>
              <Link
                href="/shop"
                className="mt-4 px-6 py-3 rounded-xl font-bold text-sm text-white bg-base-900 border border-white/10 hover:border-primary-500 hover:text-primary-400 transition-colors"
              >
                Go to Store
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
