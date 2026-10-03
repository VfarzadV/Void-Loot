import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full pt-8 pb-4 px-8 lg:px-16 flex items-center justify-between z-40 relative">
      <Link
        href="/"
        className="text-3xl font-black tracking-tighter text-base-50 flex items-center gap-1"
      >
        Nexus
        <span className="text-primary-500 drop-shadow-[0_0_10px_rgba(170,79,255,0.5)]">{`{}`}</span>
      </Link>
      <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-base-300">
        {["Home", "About us", "Portfolio", "News"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase().replace(" ", "")}`}
            className="relative group hover:text-base-50 transition-colors"
          >
            {item}
            <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-primary-500 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0 shadow-[0_0_8px_rgba(170,79,255,0.8)]"></span>
          </Link>
        ))}
      </nav>
      <Link
        href="/contact"
        className="hidden sm:inline-flex relative group px-6 py-2.5 rounded-xl font-bold text-sm text-white overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-primary-400 group-hover:scale-105 transition-transform duration-300"></span>
        <span className="relative z-10 flex items-center gap-2">
          Contact us
        </span>
        <span className="absolute -bottom-2 left-1/2 w-1/2 h-4 bg-white/30 blur-md rounded-full -translate-x-1/2"></span>
      </Link>
    </header>
  );
}
