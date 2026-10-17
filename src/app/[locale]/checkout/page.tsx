"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CreditCard,
  Bitcoin,
  Wallet,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("checkout");
  const { items, clearCart } = useCartStore();
  const { user, addOrder } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const newOrderId = `VOID-${Math.floor(Math.random() * 1000000)}`;
      setOrderId(newOrderId);
      if (user && addOrder) {
        const today = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const itemsSummary =
          items.length === 1
            ? `${items[0].quantity}x ${items[0].title}`
            : `${items.length} Items (inc. ${items[0].title})`;
        addOrder({
          id: newOrderId,
          date: today,
          status: "Processing",
          total: `$${total.toFixed(2)}`,
          items: itemsSummary,
        });
      }
      clearCart();
      toast.success("Payment successful! Welcome to the Void.");
    }, 2500);
  };

  if (!isMounted) return null;

  if (isSuccess) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <CheckCircle2 size={48} className="text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2">
          Order Confirmed!
        </h1>
        <p className="text-base-400 text-sm mb-8 max-w-md">
          Your transaction was successful. The digital keys have been sent to
          your email and hardware is being prepped for shipment.
        </p>
        <div className="glass-panel p-6 rounded-2xl bg-base-900/50 border border-white/5 mb-8 flex gap-8">
          <div className="flex flex-col">
            <span className="text-xs text-base-500 uppercase tracking-widest font-bold">
              Order ID
            </span>
            <span className="text-lg text-white font-mono">{orderId}</span>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-xs text-base-500 uppercase tracking-widest font-bold">
              Total Paid
            </span>
            <span className="text-lg text-primary-400 font-black">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
        <Link
          href="/profile"
          className="px-8 py-4 rounded-xl font-black text-sm text-base-950 bg-white hover:bg-base-200 transition-colors shadow-lg"
        >
          View in Dashboard
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4">
          Your cart is empty
        </h2>
        <p className="text-base-400 text-sm mb-6">
          You need some loot before you can checkout.
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-bold transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-350 mx-auto overflow-hidden">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-base-900 border border-white/5 text-base-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} className="rtl:rotate-180" />
        </button>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {t("title").split(" ")[0]}{" "}
          <span className="text-primary-400">
            {t("title").split(" ").slice(1).join(" ")}
          </span>
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <form
            id="checkout-form"
            onSubmit={handleCheckout}
            className="flex flex-col gap-8"
          >
            <div className="glass-panel p-6 md:p-8 rounded-3xl bg-base-950/60 border border-white/5 flex flex-col gap-6">
              <h2 className="text-xl font-black text-white border-b border-white/5 pb-4">
                {t("billingInfo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="checkout-first-name"
                    className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                  >
                    {t("firstName")}
                  </label>
                  <input
                    id="checkout-first-name"
                    required
                    type="text"
                    defaultValue={user?.name?.split(" ")[0] || ""}
                    className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="checkout-last-name"
                    className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                  >
                    {t("lastName")}
                  </label>
                  <input
                    id="checkout-last-name"
                    required
                    type="text"
                    defaultValue={user?.name?.split(" ")[1] || ""}
                    className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label
                    htmlFor="checkout-email"
                    className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                  >
                    {t("email")}
                  </label>
                  <input
                    id="checkout-email"
                    required
                    type="email"
                    defaultValue={user?.email || ""}
                    className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 md:p-8 rounded-3xl bg-base-950/60 border border-white/5 flex flex-col gap-6">
              <h2 className="text-xl font-black text-white border-b border-white/5 pb-4">
                {t("paymentMethod")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(170,79,255,0.2)]"
                      : "border-base-800 bg-base-900/30 hover:border-white/10"
                  }`}
                >
                  <CreditCard
                    size={24}
                    className={
                      paymentMethod === "card"
                        ? "text-primary-400"
                        : "text-base-400"
                    }
                  />
                  <span
                    className={`text-xs font-bold ${
                      paymentMethod === "card"
                        ? "text-primary-400"
                        : "text-base-400"
                    }`}
                  >
                    {t("creditCard")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "crypto"
                      ? "border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                      : "border-base-800 bg-base-900/30 hover:border-white/10"
                  }`}
                >
                  <Bitcoin
                    size={24}
                    className={
                      paymentMethod === "crypto"
                        ? "text-orange-400"
                        : "text-base-400"
                    }
                  />
                  <span
                    className={`text-xs font-bold ${
                      paymentMethod === "crypto"
                        ? "text-orange-400"
                        : "text-base-400"
                    }`}
                  >
                    {t("crypto")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "wallet"
                      ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "border-base-800 bg-base-900/30 hover:border-white/10"
                  }`}
                >
                  <Wallet
                    size={24}
                    className={
                      paymentMethod === "wallet"
                        ? "text-emerald-400"
                        : "text-base-400"
                    }
                  />
                  <span
                    className={`text-xs font-bold ${
                      paymentMethod === "wallet"
                        ? "text-emerald-400"
                        : "text-base-400"
                    }`}
                  >
                    {t("voidWallet")}
                  </span>
                </button>
              </div>
              {paymentMethod === "card" && (
                <div className="flex flex-col gap-5 mt-4 animate-in fade-in duration-300">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="checkout-card-number"
                      className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                    >
                      {t("cardNumber")}
                    </label>
                    <input
                      id="checkout-card-number"
                      required
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white font-mono focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="checkout-card-expiry"
                        className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                      >
                        {t("expiryDate")}
                      </label>
                      <input
                        id="checkout-card-expiry"
                        required
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white font-mono focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="checkout-card-cvc"
                        className="text-[10px] font-bold text-base-400 uppercase tracking-wider ms-1"
                      >
                        {t("cvc")}
                      </label>
                      <input
                        id="checkout-card-cvc"
                        required
                        type="text"
                        placeholder="123"
                        className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 px-4 text-sm text-white font-mono focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl bg-base-900/30 border border-white/5 sticky top-28 flex flex-col gap-6">
            <h2 className="text-xl font-black text-white border-b border-white/5 pb-4">
              {t("orderSummary")}
            </h2>
            <div className="flex flex-col gap-4 max-h-75 overflow-y-auto hide-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-xl bg-base-950 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover opacity-80"
                    />
                    <span className="absolute top-1 inset-e-1 bg-primary-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-col grow">
                    <span className="text-sm font-bold text-white line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-xs text-primary-400 font-black">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5 text-sm">
              <div className="flex justify-between items-center text-base-300">
                <span>{t("subtotal")}</span>
                <span className="font-bold text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-base-300">
                <span>{t("tax")}</span>
                <span className="font-bold text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-base-300">
                <span>{t("shipping")}</span>
                <span className="font-bold text-emerald-400">{t("free")}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-base font-bold text-white">
                {t("total")}
              </span>
              <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              form="checkout-form"
              type="submit"
              disabled={isProcessing}
              className="w-full mt-2 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />{" "}
                  {t("processing")}
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> {t("payButton")} ${total.toFixed(2)}
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-base-500 mt-2">
              {t("terms")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
