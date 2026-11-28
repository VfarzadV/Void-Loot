"use client";

import Link from "next/link";
import { Hexagon, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

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

export default function Footer() {
  const t = useTranslations("footer");

  const PLATFORM_LINKS = [
    { label: t("browseGames"), href: "/games" },
    { label: t("trendingStore"), href: "/shop" },
    { label: t("flashDeals"), href: "/deals" },
    { label: t("voidCommunity"), href: "/community" },
  ];

  const SUPPORT_LINKS = [
    { label: t("helpCenter"), href: "/faq" },
    { label: t("orderTracking"), href: "/tracking" },
    { label: t("hardwareCompare"), href: "/hardware/compare" },
    { label: t("contactUs"), href: "/support" },
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
              {t("desc")}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {[
                {
                  label: "X",
                  href: "https://x.com/VfarzadV",
                  Icon: TwitterIcon,
                },
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/VfarzadV/",
                  Icon: InstagramIcon,
                },
              ].map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-base-900 border border-white/5 flex items-center justify-center text-base-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 hover:shadow-[0_0_15px_rgba(170,79,255,0.4)] hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              {t("platformTitle")}
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
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 rtl:group-hover:translate-x-0 transition-all text-primary-500"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              {t("supportTitle")}
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
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 rtl:group-hover:translate-x-0 transition-all text-primary-500"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              {t("stayConnected")}
            </h4>
            <p className="text-sm text-base-400 leading-relaxed">
              {t("subscribeDesc")}
            </p>
            <p className="text-xs text-base-500">{t("newsletterUnavailable")}</p>
            <Link
              href="/support"
              className="text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors"
            >
              {t("contactUs")}
            </Link>
          </div>
        </div>

        <div className="w-full pt-8 border-t border-base-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-base-500 font-medium">
            {new Date().getFullYear()} Void Loot. {t("allRights")}{" "}
            {t("designedBy")}
          </p>
        </div>
      </div>
    </footer>
  );
}
