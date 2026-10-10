"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const NavItem = ({
  icon: Icon,
  href,
  active = false,
}: {
  icon: LucideIcon;
  href: string;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group ${
      active
        ? "bg-primary-500/10 text-primary-400 shadow-[inset_0_0_12px_rgba(170,79,255,0.1)]"
        : "text-base-400 hover:bg-base-800/60 hover:text-primary-300"
    }`}
  >
    <Icon
      size={18}
      className={`transition-transform duration-300 group-hover:scale-110 ${
        active ? "drop-shadow-[0_0_8px_rgba(170,79,255,0.6)]" : ""
      }`}
    />
    {active && (
      <span className="absolute left-0 w-1 h-7 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(170,79,255,0.8)]" />
    )}
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-6 bg-base-950/90 backdrop-blur-xl border-r border-base-800/40 z-50">
      <Link
        href="/"
        className="mb-8 text-primary-500 transition-all duration-500 hover:rotate-90 hover:drop-shadow-[0_0_15px_rgba(170,79,255,0.8)]"
      >
        <Hexagon size={28} strokeWidth={2.5} />
      </Link>
      <nav className="flex flex-col gap-3 grow">
        <NavItem href="/" icon={Home} active={pathname === "/"} />
        <NavItem
          href="/shop"
          icon={LayoutGrid}
          active={pathname.startsWith("/shop")}
        />
        <NavItem
          href="/games"
          icon={Gamepad2}
          active={pathname.startsWith("/games")}
        />
        <NavItem
          href="/media"
          icon={Film}
          active={pathname.startsWith("/media")}
        />
        <NavItem
          href="/live"
          icon={Radio}
          active={pathname.startsWith("/live")}
        />
        <NavItem
          href="/cloud"
          icon={Cloud}
          active={pathname.startsWith("/cloud")}
        />
      </nav>
      <div className="flex flex-col gap-3 mt-auto">
        <NavItem
          href="/profile"
          icon={User}
          active={pathname.startsWith("/profile")}
        />
        <NavItem
          href="/settings"
          icon={Settings}
          active={pathname.startsWith("/settings")}
        />
      </div>
    </aside>
  );
}
