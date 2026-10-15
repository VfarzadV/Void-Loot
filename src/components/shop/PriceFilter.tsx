"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlMaxPrice = searchParams.get("maxPrice") || "2000";

  const [price, setPrice] = useState(urlMaxPrice);
  const [prevUrlPrice, setPrevUrlPrice] = useState(urlMaxPrice);

  if (urlMaxPrice !== prevUrlPrice) {
    setPrevUrlPrice(urlMaxPrice);
    setPrice(urlMaxPrice);
  }

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (price !== "2000") {
      params.set("maxPrice", price);
    } else {
      params.delete("maxPrice");
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="range"
        aria-label="Maximum price"
        min="0"
        max="2000"
        step="50"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onMouseUp={applyFilter}
        onTouchEnd={applyFilter}
        className="w-full accent-primary-500 cursor-pointer"
      />
      <div className="flex items-center justify-between text-xs font-bold text-base-400 font-mono">
        <span>$0</span>
        <span className={price !== "2000" ? "text-primary-400" : ""}>
          Up to ${price}
        </span>
      </div>
    </div>
  );
}
