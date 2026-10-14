"use client";

import Link from "next/link";
import { Hexagon, Mail, ChevronRight } from "lucide-react";

const TwitterIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const DiscordIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
    <path d="M15 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
    <path d="M20.25 4.75a17.2 17.2 0 0 0-4.3-1.4 12.2 12.2 0 0 0-.5 1.1 16 16 0 0 0-6.9 0 12.2 12.2 0 0 0-.5-1.1 17.2 17.2 0 0 0-4.3 1.4 17.8 17.8 0 0 0-3 12c1.9 2.5 4.9 3.1 7.8 3.3a12 12 0 0 0 1.6-2.6c-.6-.2-1.3-.5-1.9-.9 1.1-.8 2-1.6 2-1.6 3 1.1 6.5 1.1 9.5 0 0 0 1.1.8 2 1.6-.6.4-1.3.7-1.9.9.5.9 1.1 1.8 1.6 2.6 3-.2 5.9-.8 7.8-3.3-1-4.7-2-9.6-3.1-12z"></path>
  </svg>
);

export default function Footer() {
  const PLATFORM_LINKS = [
    { label: "Browse Games", href: "/games" },
    { label: "Trending Store", href: "/shop" },
    { label: "Flash Deals", href: "/deals" },
    { label: "Void Community", href: "/community" },
  ];

  const SUPPORT_LINKS = [
    { label: "Help Center (FAQ)", href: "/faq" },
    { label: "Order Tracking", href: "/tracking" },
    { label: "Hardware Compare", href: "/hardware/compare" },
    { label: "Contact Us", href: "/support" },
  ];

  return (
    <footer className="w-full relative z-10 bg-base-950 pt-20 pb-8 border-t border-white/5 overflow-hidden mt-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-32 bg-primary-500/10 blur-[100px] pointer-events-none z-0"></div>
      
      <div className="w-full px-8 lg:px-16 flex flex-col gap-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link
              href="/"
              className="text-3xl font-black tracking-tighter text-base-50 flex items-center gap-2 group"
            >
              <Hexagon
                className="text-primary-500 group-hover:rotate-90 transition-transform duration-500"
                size={32}
                strokeWidth={2.5}
              />
              Void
              <span className="text-primary-500 drop-shadow-[0_0_10px_rgba(170,79,255,0.5)]">
                Loot
              </span>
            </Link>
            <p className="text-sm text-base-400 leading-relaxed max-w-sm">
              The ultimate destination for next-gen gamers. Explore massive game
              libraries, premium hardware, and exclusive digital deals all in
              one immersive platform.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {[TwitterIcon, InstagramIcon, YoutubeIcon, DiscordIcon].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-base-900 border border-white/5 flex items-center justify-center text-base-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 hover:shadow-[0_0_15px_rgba(170,79,255,0.4)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                ),
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="flex flex-col gap-3">
              {PLATFORM_LINKS.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-base-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-500"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              Support
            </h4>
            <ul className="flex flex-col gap-3">
              {SUPPORT_LINKS.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-base-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-500"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              Stay Connected
            </h4>
            <p className="text-sm text-base-400 leading-relaxed">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals before anyone else.
            </p>
            <form
              aria-label="Subscribe to email updates"
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
                />
                <input
                  type="email"
                  aria-label="Email address for newsletter"
                  placeholder="Enter your email address"
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all"
                />
              </div>
              <button className="w-full bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-sm py-3.5 rounded-xl shadow-[0_4px_15px_rgba(170,79,255,0.2)] hover:shadow-[0_4px_25px_rgba(170,79,255,0.4)] transition-all">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
        
        <div className="w-full pt-8 border-t border-base-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-base-500 font-medium">
            © {new Date().getFullYear()} Void Loot. All rights reserved.
            Designed by Farzad.
          </p>
          <div className="flex items-center gap-6 text-xs text-base-500 font-medium">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}