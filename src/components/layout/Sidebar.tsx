"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Home,
  LayoutGrid,
  Gamepad2,
  Film,
  Radio,
  User,
  Cloud,
  Settings,
  Hexagon,
  LucideIcon,
  Box,
} from "lucide-react";

const NavItem = ({
  icon: Icon,
  label,
  href,
  active = false,
  isMobile = false,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  isMobile?: boolean;
}) => (
  <Link
    href={href}
    aria-label={label}
    aria-current={active ? "page" : undefined}
    className={`relative flex items-center justify-center transition-all duration-300 group ${
      isMobile
        ? `flex-col gap-1 p-2 rounded-xl text-xs font-bold ${
            active
              ? "text-primary-400 bg-primary-500/10"
              : "text-base-400 hover:text-white"
          }`
        : `w-10 h-10 rounded-xl ${
            active
              ? "bg-primary-500/10 text-primary-400 shadow-[inset_0_0_12px_rgba(170,79,255,0.1)]"
              : "text-base-400 hover:bg-base-800/60 hover:text-primary-300"
          }`
    }`}
  >
    <Icon
      size={isMobile ? 20 : 18}
      className={`transition-transform duration-300 group-hover:scale-110 ${
        active ? "drop-shadow-[0_0_8px_rgba(170,79,255,0.6)]" : ""
      }`}
    />
    {!isMobile && active && (
      <span className="absolute inset-s-0 w-1 h-7 bg-primary-500 rounded-e-full shadow-[0_0_10px_rgba(170,79,255,0.8)]" />
    )}
    {isMobile && <span className="text-[10px] scale-90">{label}</span>}
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  return (
    <>
      <aside className="hidden md:flex fixed inset-s-0 top-0 h-screen w-20 flex-col items-center py-6 bg-base-950/90 backdrop-blur-xl border-e border-base-800/40 z-50">
        <Link
          href="/"
          aria-label="Void Loot home"
          className="mb-8 text-primary-500 transition-all duration-500 hover:rotate-90 hover:drop-shadow-[0_0_15px_rgba(170,79,255,0.8)]"
        >
          <Hexagon size={28} strokeWidth={2.5} />
        </Link>

        <nav aria-label="Main navigation" className="flex flex-col gap-3 grow">
          <NavItem
            href="/"
            label={t("home")}
            icon={Home}
            active={pathname === "/en" || pathname === "/fa"}
          />
          <NavItem
            href="/shop"
            label={t("hardwareShop")}
            icon={LayoutGrid}
            active={pathname.includes("/shop")}
          />
          <NavItem
            href="/games"
            label={t("games")}
            icon={Gamepad2}
            active={pathname.includes("/games")}
          />
          <NavItem
            href="/media"
            label={t("media")}
            icon={Film}
            active={pathname.includes("/media")}
          />
          <NavItem
            href="/live"
            label={t("liveStreams")}
            icon={Radio}
            active={pathname.includes("/live")}
          />
          <NavItem
            href="/cloud"
            label={t("cloudGaming")}
            icon={Cloud}
            active={pathname.includes("/cloud")}
          />
          <NavItem
            href="/loot-box"
            label={t("lootBox")}
            icon={Box}
            active={pathname.includes("/loot-box")}
          />
        </nav>

        <div className="flex flex-col gap-3 mt-auto">
          <NavItem
            href="/profile"
            label={t("profile")}
            icon={User}
            active={pathname.includes("/profile")}
          />
          <NavItem
            href="/settings"
            label={t("settings")}
            icon={Settings}
            active={pathname.includes("/settings")}
          />
        </div>
      </aside>

      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-base-950/95 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2"
      >
        <NavItem
          href="/"
          label={t("home")}
          icon={Home}
          active={pathname === "/en" || pathname === "/fa"}
          isMobile
        />
        <NavItem
          href="/shop"
          label={t("hardwareShop")}
          icon={LayoutGrid}
          active={pathname.includes("/shop")}
          isMobile
        />
        <NavItem
          href="/games"
          label={t("games")}
          icon={Gamepad2}
          active={pathname.includes("/games")}
          isMobile
        />
        <NavItem
          href="/media"
          label={t("media")}
          icon={Film}
          active={pathname.includes("/media")}
          isMobile
        />
        <NavItem
          href="/profile"
          label={t("profile")}
          icon={User}
          active={pathname.includes("/profile")}
          isMobile
        />
      </nav>
    </>
  );
}
