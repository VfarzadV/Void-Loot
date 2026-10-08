import Link from "next/link";
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
    className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group ${
      active
        ? "bg-primary-500/10 text-primary-400 shadow-[inset_0_0_15px_rgba(170,79,255,0.1)]"
        : "text-base-400 hover:bg-base-800/60 hover:text-primary-300"
    }`}
  >
    <Icon
      size={22}
      className={`transition-transform duration-300 group-hover:scale-110 ${active ? "drop-shadow-[0_0_8px_rgba(170,79,255,0.6)]" : ""}`}
    />
    {active && (
      <span className="absolute left-0 w-1.5 h-8 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(170,79,255,0.8)]" />
    )}
  </Link>
);

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-24 flex flex-col items-center py-8 bg-base-950/90 backdrop-blur-xl border-r border-base-800/40 z-50">
      <Link
        href="/"
        className="mb-10 text-primary-500 transition-all duration-500 hover:rotate-90 hover:drop-shadow-[0_0_15px_rgba(170,79,255,0.8)]"
      >
        <Hexagon size={36} strokeWidth={2.5} />
      </Link>
      <nav className="flex flex-col gap-4 grow">
        <NavItem href="/" icon={Home} active={true} />
        <NavItem href="/shop" icon={LayoutGrid} />
        <NavItem href="/games" icon={Gamepad2} />
        <NavItem href="/media" icon={Film} />
        <NavItem href="/live" icon={Radio} />
        <NavItem href="/cloud" icon={Cloud} />
      </nav>
      <div className="flex flex-col gap-4 mt-auto">
        <NavItem href="/profile" icon={User} />
        <NavItem href="/settings" icon={Settings} />
      </div>
    </aside>
  );
}
