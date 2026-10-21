"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("breadcrumbs");

  const paths = pathname.split("/").filter((p) => p !== "");
  const segments = paths.slice(1);

  if (segments.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("home"),
        item: "https://voidloot.com/",
      },
      ...segments.map((segment, index) => {
        const href = "/" + paths.slice(0, index + 2).join("/");
        const isId = /^\d+$/.test(segment) || segment.length > 20;
        const label = t.has(segment)
          ? t(segment)
          : isId
          ? t("details")
          : decodeURIComponent(segment).replace(/-/g, " ");

        return {
          "@type": "ListItem",
          position: index + 2,
          name: label,
          item: `https://voidloot.com${href}`,
        };
      }),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold mb-6 overflow-x-auto hide-scrollbar whitespace-nowrap w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Link
        href="/"
        className="text-base-500 hover:text-primary-400 transition-colors flex items-center gap-1.5"
      >
        <Home size={14} />
        {t("home")}
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = "/" + paths.slice(0, index + 2).join("/");
        const isId = /^\d+$/.test(segment) || segment.length > 20;
        
        const label = t.has(segment)
          ? t(segment)
          : isId
          ? t("details")
          : decodeURIComponent(segment).replace(/-/g, " ");

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-base-700 rtl:rotate-180 shrink-0" />
            {isLast ? (
              <span
                className="text-white bg-base-900/50 border border-white/5 px-2.5 py-1 rounded-md capitalize truncate max-w-37.5 sm:max-w-none"
                aria-current="page"
              >
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-base-500 hover:text-primary-400 transition-colors capitalize"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}