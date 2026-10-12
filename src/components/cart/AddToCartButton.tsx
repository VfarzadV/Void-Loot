"use client";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.title} added to loot!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-base-900 border border-white/10 text-base-300 transition-all hover:bg-primary-600 hover:text-white hover:border-primary-500 hover:shadow-[0_0_15px_rgba(170,79,255,0.4)] group/btn z-20 relative"
      title="Add to Cart"
    >
      <ShoppingBag
        size={18}
        className="group-hover/btn:scale-110 transition-transform"
      />
    </button>
  );
}
