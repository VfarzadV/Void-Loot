"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ProductItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface AddToCartFullButtonProps {
  product: ProductItem;
}

export default function AddToCartFullButton({
  product,
}: AddToCartFullButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const t = useTranslations("common");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(t("addedToLoot", { item: product.title }));
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full py-4 rounded-xl font-black text-white bg-linear-to-r from-primary-600 to-primary-400 hover:from-primary-500 hover:to-primary-300 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all flex items-center justify-center gap-2 group"
    >
      <ShoppingBag
        size={20}
        aria-hidden="true"
        className="group-hover:scale-110 transition-transform"
      />
      {t("addToCart")}
    </button>
  );
}