"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, ArrowUpDown } from "lucide-react";

export default function GameSortDropdown() {
  const t = useTranslations("gameSort");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get("sort") || "-added";

  const SORT_OPTIONS = [
    { label: t("popular"), value: "-added" },
    { label: t("newest"), value: "-released" },
    { label: t("rating"), value: "-rating" },
    { label: t("name"), value: "name" },
  ];

  const selectedOption =
    SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Sort games"
        className="flex items-center gap-3 bg-base-900/80 border border-base-800 hover:border-primary-500/50 rounded-xl py-2.5 px-4 text-xs font-bold text-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
      >
        <ArrowUpDown size={14} className="text-primary-400" />
        <span className="text-base-400">{t("label")}</span>
        <span className="text-white">{selectedOption.label}</span>
        <ChevronDown
          size={14}
          className={`text-base-400 transition-transform duration-300 ms-1 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Sort options"
          className="absolute inset-e-0 top-full mt-2 w-52 glass-panel bg-base-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {SORT_OPTIONS.map((opt) => {
            const isSelected = opt.value === currentSort;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-start px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-primary-500/15 text-primary-400"
                    : "text-base-300 hover:bg-base-900 hover:text-white"
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}