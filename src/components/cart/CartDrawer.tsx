"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isOpen, toggleCart, items, removeItem, updateQuantity, clearCart } =
    useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-base-950/80 backdrop-blur-sm z-50 transition-opacity"
          onClick={toggleCart}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`fixed top-0 right-0 h-full w-full sm:w-100 glass-panel bg-base-950/95 border-l border-white/10 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary-500" aria-hidden="true" /> My Loot
          </h2>
          <button
            onClick={toggleCart}
            aria-label="Close Cart"
            className="p-2 rounded-xl bg-base-900 border border-white/5 text-base-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-50">
              <ShoppingBag size={48} className="text-base-600" />
              <p className="text-sm font-bold text-base-400">
                Your cart is empty.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-2xl bg-base-900/50 border border-white/5 relative group"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex flex-col grow justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                      {item.title}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-base-500 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black text-primary-400">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-3 bg-base-950 px-2 py-1 rounded-lg border border-white/5">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="text-base-400 hover:text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="text-base-400 hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-base-950 shrink-0 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-400 font-bold uppercase tracking-wider">
                Total
              </span>
              <span className="text-2xl font-black text-white">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => {
                toggleCart();
                router.push("/checkout");
              }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all group"
            >
              Proceed to Checkout{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-base-500 hover:text-white transition-colors text-center w-full"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
