"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sliders } from "lucide-react";

export default function PriceFilter() {
  const t = useTranslations("priceFilter");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMax = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : 2000;

  const [price, setPrice] = useState(currentMax);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("maxPrice", price.toString());
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-base-900/40 border border-white/5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Sliders size={14} className="text-primary-400" /> {t("max")}
        </span>
        <span className="text-sm font-black text-primary-400 font-mono">
          ${price}
        </span>
      </div>

      <input
        type="range"
        min="50"
        max="2000"
        step="50"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full accent-primary-500 bg-base-950 rounded-lg h-2 cursor-pointer"
      />

      <div className="flex items-center justify-between text-[10px] text-base-500 font-mono">
        <span>$50</span>
        <span>$2000+</span>
      </div>

      <button
        onClick={handleApply}
        className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-black shadow-[0_0_15px_rgba(170,79,255,0.3)] transition-all mt-2"
      >
        {t("apply")}
      </button>
    </div>
  );
}
