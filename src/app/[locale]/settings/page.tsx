"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  User,
  Shield,
  Link as LinkIcon,
  Monitor,
  Bell,
  Save,
  Gamepad2,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";

const SETTINGS_TABS = [
  { id: "account", icon: User },
  { id: "security", icon: Shield },
  { id: "connections", icon: LinkIcon },
  { id: "preferences", icon: Monitor },
  { id: "notifications", icon: Bell },
];

const CONNECTED_ACCOUNTS = [
  {
    id: "steam",
    name: "Steam",
    username: "ShadowHunter_99",
    connected: true,
    color: "bg-[#171a21]",
    textColor: "text-white",
  },
  {
    id: "discord",
    name: "Discord",
    username: "Farzad#1234",
    connected: true,
    color: "bg-[#5865F2]",
    textColor: "text-white",
  },
  {
    id: "psn",
    name: "PlayStation Network",
    username: "",
    connected: false,
    color: "bg-[#003087]",
    textColor: "text-white",
  },
  {
    id: "xbox",
    name: "Xbox Live",
    username: "",
    connected: false,
    color: "bg-[#107C10]",
    textColor: "text-white",
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.startsWith("/fa") ? "fa" : "en";
  const t = useTranslations("settings");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    if (nextLocale === currentLocale) return;

    const pathWithoutLocale = pathname.replace(/^\/(en|fa)(?=\/|$)/, "");
    const newPath = `/${nextLocale}${pathWithoutLocale || ""}`;
    router.push(newPath);
    router.refresh();
  };

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col mb-10 border-b border-white/5 pb-6">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-base-400 mt-2">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-2">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-xl transition-all duration-300 text-sm font-bold ${
                  isActive
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/30 shadow-[inset_0_0_15px_rgba(170,79,255,0.1)]"
                    : "text-base-400 hover:bg-base-900 hover:text-white border border-transparent"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-primary-400" : "text-base-500"}
                />
                {t(`tabs.${tab.id}`)}
              </button>
            );
          })}
        </aside>

        <div className="grow glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 md:p-10 flex flex-col min-h-150">
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col gap-8">
              <div className="flex flex-col gap-1 pb-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white">
                  {t("account.title")}
                </h2>
                <p className="text-xs text-base-400">{t("account.desc")}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 group shrink-0 bg-base-900">
                  <Image
                    src="https://i.pravatar.cc/150?u=farzad"
                    alt="Avatar"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 grow w-full">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="settings-display-name"
                      className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1"
                    >
                      {t("account.displayName")}
                    </label>
                    <input
                      id="settings-display-name"
                      type="text"
                      defaultValue="Farzad"
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="settings-username"
                      className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1"
                    >
                      {t("account.username")}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-base-500 font-bold">
                        @
                      </span>
                      <input
                        id="settings-username"
                        type="text"
                        defaultValue="ShadowHunter99"
                        className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 ps-9 pe-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="settings-bio"
                  className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1"
                >
                  {t("account.bio")}
                </label>
                <textarea
                  id="settings-bio"
                  rows={4}
                  placeholder={t("account.bioPlaceholder")}
                  defaultValue="Front-end developer & Hardcore gamer. Exploring the void one game at a time."
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] resize-none"
                />
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all">
                  <Save size={16} /> {t("account.save")}
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col gap-8">
              <div className="flex flex-col gap-1 pb-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white">
                  {t("security.title")}
                </h2>
                <p className="text-xs text-base-400">{t("security.desc")}</p>
              </div>

              <div className="flex flex-col gap-4 max-w-xl">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                    {t("security.current")}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                    {t("security.new")}
                  </label>
                  <input
                    type="password"
                    placeholder={t("security.newPlaceholder")}
                    className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                    {t("security.confirm")}
                  </label>
                  <input
                    type="password"
                    placeholder={t("security.confirmPlaceholder")}
                    className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <button className="w-fit mt-2 px-6 py-2.5 rounded-xl font-bold text-xs text-base-950 bg-white hover:bg-base-200 transition-colors">
                  {t("security.updateBtn")}
                </button>
              </div>

              <div className="w-full h-px bg-white/5 my-2"></div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-emerald-500" />
                  <h3 className="text-lg font-black text-white">
                    {t("security.2faTitle")}
                  </h3>
                </div>
                <div className="flex items-center justify-between p-5 rounded-2xl bg-base-900/30 border border-emerald-500/20">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> {t("security.2faEnabled")}
                    </span>
                    <span className="text-xs text-base-400">
                      {t("security.2faDesc")}
                    </span>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-base-950 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/10 transition-colors">
                    {t("security.disableBtn")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "connections" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col gap-8">
              <div className="flex flex-col gap-1 pb-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white">
                  {t("connections.title")}
                </h2>
                <p className="text-xs text-base-400">{t("connections.desc")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONNECTED_ACCOUNTS.map((account) => (
                  <div
                    key={account.id}
                    className="flex flex-col gap-4 p-5 rounded-2xl bg-base-900/30 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${account.color} ${account.textColor} shadow-lg`}
                        >
                          <Gamepad2 size={20} />
                        </div>
                        <span className="text-sm font-bold text-white">
                          {account.name}
                        </span>
                      </div>
                      {account.connected ? (
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          {t("connections.connected")}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-base-500 uppercase tracking-widest bg-base-950 px-2.5 py-1 rounded-md border border-white/5">
                          {t("connections.notLinked")}
                        </span>
                      )}
                    </div>
                    {account.connected ? (
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                        <span className="text-xs font-bold text-base-300">
                          {account.username}
                        </span>
                        <button className="text-[10px] font-bold text-base-500 hover:text-rose-400 transition-colors uppercase tracking-wider">
                          {t("connections.disconnect")}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 pt-4 border-t border-white/5">
                        <button className="w-full py-2 rounded-lg bg-base-950 border border-white/10 text-xs font-bold text-white hover:border-primary-500 hover:text-primary-400 transition-colors">
                          {t("connections.connectBtn")}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col gap-8">
              <div className="flex flex-col gap-1 pb-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white">
                  {t("preferences.title")}
                </h2>
                <p className="text-xs text-base-400">{t("preferences.desc")}</p>
              </div>

              <div className="flex flex-col gap-6">
                <div
                  role="group"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {mounted && (
                    <>
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === "dark" ? "border-primary-500 bg-base-900/50" : "border-transparent bg-base-900/30 hover:border-white/10"}`}
                      >
                        <div className="w-full h-16 rounded-lg bg-black border border-white/10 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-s-0 top-0 w-1/3 h-full bg-[#111]"></div>
                        </div>
                        <span
                          className={`text-xs font-bold ${theme === "dark" ? "text-primary-400" : "text-base-500"}`}
                        >
                          {t("preferences.darkMode")}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === "light" ? "border-primary-500 bg-base-900/50" : "border-transparent bg-base-900/30 hover:border-white/10"}`}
                      >
                        <div className="w-full h-16 rounded-lg bg-[#fafafa] border border-gray-300 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-s-0 top-0 w-1/3 h-full bg-[#eee]"></div>
                        </div>
                        <span
                          className={`text-xs font-bold ${theme === "light" ? "text-primary-400" : "text-base-500"}`}
                        >
                          {t("preferences.lightMode")}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("system")}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === "system" ? "border-primary-500 bg-base-900/50" : "border-transparent bg-base-900/30 hover:border-white/10"}`}
                      >
                        <div className="w-full h-16 rounded-lg bg-linear-to-r from-black to-white flex items-center justify-center relative overflow-hidden border border-gray-500"></div>
                        <span
                          className={`text-xs font-bold ${theme === "system" ? "text-primary-400" : "text-base-500"}`}
                        >
                          {t("preferences.systemSync")}
                        </span>
                      </button>
                    </>
                  )}
                </div>

                <div className="w-full h-px bg-white/5 my-2"></div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="settings-language"
                    className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1"
                  >
                    {t("preferences.languageRegion")}
                  </label>
                  <select
                    id="settings-language"
                    value={currentLocale}
                    onChange={handleLanguageChange}
                    className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="en">English (United States)</option>
                    <option value="fa">Persian (Farsi) - فارسی</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col gap-8">
              <div className="flex flex-col gap-1 pb-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white">
                  {t("notifications.title")}
                </h2>
                <p className="text-xs text-base-400">
                  {t("notifications.desc")}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    title: t("notifications.order"),
                    desc: t("notifications.orderDesc"),
                    active: true,
                  },
                  {
                    title: t("notifications.wishlist"),
                    desc: t("notifications.wishlistDesc"),
                    active: true,
                  },
                  {
                    title: t("notifications.cloud"),
                    desc: t("notifications.cloudDesc"),
                    active: false,
                  },
                  {
                    title: t("notifications.promo"),
                    desc: t("notifications.promoDesc"),
                    active: false,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl bg-base-900/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">
                        {item.title}
                      </span>
                      <span className="text-xs text-base-500">{item.desc}</span>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${item.active ? "bg-primary-500 justify-end shadow-[0_0_10px_rgba(170,79,255,0.4)]" : "bg-base-800 justify-start"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${item.active ? "bg-white" : "bg-base-400"}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
