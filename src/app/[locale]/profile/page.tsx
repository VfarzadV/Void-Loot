"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  Star,
  LogOut,
  Edit2,
  Gamepad2,
  Cloud,
  Trophy,
  Package,
  ChevronRight,
  ShoppingCart,
  Trash2,
  Activity,
  Plus,
  Minus,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [activeTab, setActiveTab] = useState("overview");
  const [isMounted, setIsMounted] = useState(false);
  const { items: wishlistItems, removeItem: removeWishlistItem } =
    useWishlistStore();
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const { addItem, activityLog } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const ordersList = user.orders || [];

  const TABS = [
    { id: "overview", label: t("tabs.overview"), icon: User },
    { id: "orders", label: t("tabs.orders"), icon: ShoppingBag },
    { id: "wishlist", label: t("tabs.wishlist"), icon: Heart },
    { id: "settings", label: t("tabs.settings"), icon: Settings },
  ];

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile({
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      avatar: formData.get("avatar") as string,
      banner: formData.get("banner") as string,
    });
    toast.success(t("updateSuccess"));
  };

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-6 max-w-[1600px] mx-auto overflow-hidden">
      <div className="w-full relative mb-32 md:mb-36">
        <div className="w-full relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden border border-white/10 group bg-base-950 shadow-2xl">
          <Image
            src={
              user.banner ||
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
            }
            alt="Profile Banner"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-base-950 via-base-950/40 to-transparent opacity-95" />
          <div className="absolute inset-0 bg-linear-to-r from-base-950/90 via-base-950/30 to-transparent" />
          <div className="absolute -bottom-24 -inset-s-24 w-96 h-96 bg-primary-600/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-500/30 transition-colors duration-700" />
          <button
            onClick={() => setActiveTab("settings")}
            type="button"
            title={t("changeBanner")}
            className="absolute top-6 inset-e-6 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white hover:bg-primary-600 hover:border-primary-500 hover:shadow-[0_0_20px_rgba(170,79,255,0.5)] transition-all z-10"
          >
            <Edit2 size={18} />
          </button>
        </div>

        <div className="absolute -bottom-20 md:-bottom-24 inset-s-6 md:inset-s-12 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 z-20 w-[calc(100%-3rem)] md:w-auto">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-[2.25rem] p-1.5 bg-linear-to-br from-primary-500 via-primary-600 to-cyan-500 shadow-[0_15px_40px_rgba(170,79,255,0.4)] hover:shadow-[0_15px_50px_rgba(170,79,255,0.6)] transition-all duration-500 shrink-0 group/avatar cursor-pointer">
            <div className="relative w-full h-full rounded-4xl overflow-hidden border-4 border-base-950 bg-base-900">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              <div
                onClick={() => setActiveTab("settings")}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <Edit2 size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="mb-2 md:mb-8 flex flex-col items-center md:items-start drop-shadow-2xl text-center md:text-start w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {user.name}
              </h1>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-primary-600 to-primary-500 text-white text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(170,79,255,0.6)] border border-white/20">
                <Star size={14} className="fill-white" />
                {t("lvl")} {user.level}
              </div>
            </div>
            <div className="flex items-center flex-wrap justify-center md:justify-start gap-3">
              <span className="text-sm md:text-base font-bold text-primary-300 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] flex items-center gap-1.5">
                <span className="text-primary-500 font-black">@</span>
                {user.username}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2 backdrop-blur-md">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                {t("online")}
              </span>
            </div>
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
                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="ms-auto rtl:rotate-180"
                    />
                  )}
                </button>
              );
            })}
            <div className="w-full h-px bg-white/5 my-2"></div>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold text-base-400 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/30"
            >
              <LogOut size={18} className="rtl:rotate-180" /> {t("signOut")}
            </button>
          </div>

          <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-3">
              {t("accountInfo")}
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-base-500">{t("memberSince")}</span>
                <span className="font-bold text-white">{user.joinDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-500">{t("plan")}</span>
                <span className="font-bold text-primary-400">
                  {t("premium")}
                </span>
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
                      {user.stats?.cloudHours || 0}
                    </span>
                    <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
                      {t("cloudHours")}
                    </span>
                  </div>
                </div>
                <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 flex items-center gap-4 hover:border-primary-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20">
                    <Gamepad2 size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">
                      {user.stats?.gamesOwned || 0}
                    </span>
                    <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
                      {t("gamesOwned")}
                    </span>
                  </div>
                </div>
                <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 flex items-center gap-4 hover:border-primary-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center border border-yellow-500/20">
                    <Trophy size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">
                      {user.stats?.achievements || 0}
                    </span>
                    <span className="text-xs font-bold text-base-500 uppercase tracking-wider">
                      {t("achievements")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Activity size={20} className="text-primary-500" />{" "}
                    {t("recentActivity")}
                  </h2>
                </div>
                <div className="flex flex-col gap-6 relative ps-4 mt-2">
                  <div className="absolute inset-s-9 top-2 bottom-2 w-px bg-white/5 z-0"></div>
                  {activityLog.length === 0 ? (
                    <p className="text-sm text-base-400 py-4 ps-8">
                      {t("noActivity")}
                    </p>
                  ) : (
                    activityLog.slice(0, 5).map((log) => {
                      const isAdd = log.type === "add";
                      const colorClass = isAdd
                        ? "text-emerald-400"
                        : "text-rose-400";
                      const bgClass = isAdd
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-rose-500/10 border-rose-500/20";
                      const Icon = isAdd ? Plus : Minus;

                      return (
                        <div
                          key={log.id}
                          className="relative z-10 flex items-center gap-5"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${bgClass} ${colorClass} shadow-md`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="flex items-center gap-4 grow bg-base-900/30 p-3 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-base-950 shrink-0">
                              <Image
                                src={log.itemImage}
                                alt={log.itemTitle}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover opacity-80"
                              />
                            </div>
                            <div className="flex flex-col grow">
                              <span className="text-sm font-bold text-white line-clamp-1">
                                {log.itemTitle}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-widest ${colorClass}`}
                              >
                                {isAdd
                                  ? t("addedToCart")
                                  : t("removedFromCart")}
                              </span>
                            </div>
                            <span className="text-[10px] text-base-500 font-mono shrink-0 pe-2">
                              {log.date}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && ordersList.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col gap-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
                <Package size={20} className="text-primary-500" />{" "}
                {t("allOrders")}
              </h2>
              <div className="flex flex-col gap-4">
                {ordersList.map((order) => (
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
                      <span
                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${order.status === "Processing" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-base font-black text-white w-20 text-end">
                        {order.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Heart size={20} className="text-rose-500 fill-rose-500/20" />{" "}
                  {t("myWishlist")}
                </h2>
                <span className="text-xs font-bold text-base-400">
                  {wishlistItems.length} {t("items")}
                </span>
              </div>
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                  <Heart size={48} className="text-base-600 mb-4" />
                  <p className="text-sm font-bold text-base-400">
                    {t("emptyWishlist")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col justify-between gap-4 p-4 rounded-2xl bg-base-900/40 border border-white/5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-base-950 shrink-0 border border-white/5">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-sm font-bold text-white line-clamp-2">
                            {item.title}
                          </h3>
                          <span className="text-lg font-black text-primary-400 mt-1">
                            {typeof item.price === "number"
                              ? `$${item.price.toFixed(2)}`
                              : item.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                        <button
                          onClick={() => {
                            const numericPrice =
                              typeof item.price === "number"
                                ? item.price
                                : parseFloat(
                                    item.price
                                      .toString()
                                      .replace(/[^0-9.]/g, ""),
                                  ) || 0;
                            addItem({
                              id: Number(item.id),
                              title: item.title,
                              price: numericPrice,
                              image: item.image,
                            });
                            removeWishlistItem(item.id);
                          }}
                          className="grow flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs text-white bg-primary-600 hover:bg-primary-500 shadow-[0_0_15px_rgba(170,79,255,0.2)] transition-all"
                        >
                          <ShoppingCart size={14} /> {t("moveToCart")}
                        </button>
                        <button
                          onClick={() => removeWishlistItem(item.id)}
                          className="p-2.5 rounded-xl bg-base-950 border border-white/5 text-base-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                          title={t("remove")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-1 border-b border-white/5 pb-6">
                <h2 className="text-2xl font-black text-white">
                  {t("accountSettings")}
                </h2>
                <p className="text-sm text-base-400">{t("manageInfo")}</p>
              </div>

              <form
                className="flex flex-col gap-6"
                onSubmit={handleSaveProfile}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="name"
                      className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                    >
                      {t("displayName")}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={user.name}
                      required
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="username"
                      className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                    >
                      {t("username")}
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      defaultValue={user.username}
                      required
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label
                      htmlFor="avatar"
                      className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                    >
                      {t("avatarUrl")}
                    </label>
                    <input
                      id="avatar"
                      name="avatar"
                      type="url"
                      defaultValue={user.avatar}
                      required
                      placeholder="https://..."
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label
                      htmlFor="banner"
                      className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                    >
                      {t("bannerUrl")}
                    </label>
                    <input
                      id="banner"
                      name="banner"
                      type="url"
                      defaultValue={user.banner}
                      placeholder="https://..."
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-black text-sm text-white bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all"
                  >
                    {t("saveChanges")}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
