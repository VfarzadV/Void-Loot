"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";

interface WishlistButtonProps {
  product: {
    id: number | string;
    title: string;
    price: number | string;
    image: string;
  };
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWished = isInWishlist(product.id);

  return (
    <button
      type="button"
      aria-label={`Add ${product.title} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        toggleItem(product);
      }}
      className={`absolute top-3 right-3 w-8 h-8 rounded-lg bg-base-950/60 border flex items-center justify-center backdrop-blur-md z-20 transition-all ${
        isWished
          ? "text-rose-500 border-rose-500/50 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          : "border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600/40"
      }`}
    >
      <Heart
        size={16}
        className={isWished ? "fill-rose-500" : ""}
        aria-hidden="true"
      />
    </button>
  );
}
