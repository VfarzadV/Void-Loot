"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

interface CheckoutQuoteItem {
  id: number;
  title: string;
  image: string | null;
  price: string;
  quantity: number;
  lineTotal: string;
}

interface CheckoutQuote {
  items: CheckoutQuoteItem[];
  subtotal: string;
  tax: string;
  total: string;
}

interface CheckoutResponse {
  error?: string;
  quote?: CheckoutQuote;
  orderId?: string;
  total?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("checkout");
  const { items, clearCart } = useCartStore();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const checkoutItemsKey = JSON.stringify(
    items.map(({ id, quantity }) => ({ id, quantity })),
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthLoading && !isAuthenticated) {
      const returnPath = window.location.pathname;
      router.replace(`/login?redirect=${encodeURIComponent(returnPath)}`);
    }
  }, [isAuthenticated, isAuthLoading, isMounted, router]);

  const getErrorMessage = useCallback((code: string) => {
    switch (code) {
      case "AUTH_REQUIRED":
        return t("errors.authRequired");
      case "INVALID_CART":
      case "INVALID_REQUEST":
        return t("errors.invalidCart");
      case "PRODUCT_UNAVAILABLE":
        return t("errors.productUnavailable");
      case "PRICE_CHANGED":
        return t("errors.priceChanged");
      case "STOCK_UNAVAILABLE":
        return t("errors.stockUnavailable");
      case "QUOTE_FAILED":
        return t("errors.quoteFailed");
      default:
        return t("errors.orderFailed");
    }
  }, [t]);

  useEffect(() => {
    if (
      !isMounted ||
      isAuthLoading ||
      !isAuthenticated ||
      items.length === 0
    ) {
      return;
    }

    const controller = new AbortController();
    const loadQuote = async () => {
      setQuote(null);
      setQuoteError("");
      setIsLoadingQuote(true);

      try {
        const response = await fetch(
          `/api/checkout?items=${encodeURIComponent(checkoutItemsKey)}`,
          { signal: controller.signal },
        );
        const result = (await response.json()) as CheckoutResponse;
        if (!response.ok || !result.quote) {
          throw new Error(result.error || "QUOTE_FAILED");
        }
        setQuote(result.quote);
      } catch (error) {
        if (controller.signal.aborted) return;
        const code = error instanceof Error ? error.message : "QUOTE_FAILED";
        setQuoteError(getErrorMessage(code));
      } finally {
        if (!controller.signal.aborted) setIsLoadingQuote(false);
      }
    };

    void loadQuote();
    return () => controller.abort();
  }, [
    checkoutItemsKey,
    isAuthenticated,
    isAuthLoading,
    isMounted,
    items.length,
    getErrorMessage,
  ]);

  const handlePlaceOrder = async () => {
    if (!quote || isProcessing) return;
    setIsProcessing(true);
    setQuoteError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: JSON.parse(checkoutItemsKey) as Array<{
            id: number;
            quantity: number;
          }>,
          expectedTotal: quote.total,
        }),
      });
      const result = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        if (result.quote) setQuote(result.quote);
        const message = getErrorMessage(result.error || "ORDER_FAILED");
        setQuoteError(message);
        toast.error(message);
        return;
      }

      if (!result.orderId || !result.total) {
        throw new Error("ORDER_FAILED");
      }

      setOrderId(result.orderId);
      setOrderTotal(result.total);
      setIsSuccess(true);
      clearCart();
      toast.success(t("orderRecordedToast"));
    } catch (error) {
      const code = error instanceof Error ? error.message : "ORDER_FAILED";
      const message = getErrorMessage(code);
      setQuoteError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted || isAuthLoading || (!isAuthenticated && !isSuccess)) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-400" size={32} />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <CheckCircle2 size={48} className="text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2">
          {t("orderConfirmed")}
        </h1>
        <p className="text-base-400 text-sm mb-8 max-w-md">
          {t("orderSuccessDesc")}
        </p>
        <div className="glass-panel p-6 rounded-2xl bg-base-900/50 border border-white/5 mb-8 flex gap-8">
          <div className="flex flex-col">
            <span className="text-xs text-base-500 uppercase tracking-widest font-bold">
              {t("orderIdStr")}
            </span>
            <span className="text-lg text-white font-mono">{orderId}</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-xs text-base-500 uppercase tracking-widest font-bold">
              {t("totalDue")}
            </span>
            <span className="text-lg text-primary-400 font-black">
              ${orderTotal}
            </span>
          </div>
        </div>
        <Link
          href="/profile"
          className="px-8 py-4 rounded-xl font-black text-sm text-base-950 bg-white hover:bg-base-200 transition-colors shadow-lg"
        >
          {t("viewDashboard")}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4">
          {t("emptyCart")}
        </h2>
        <p className="text-base-400 text-sm mb-6">{t("emptyCartDesc")}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-bold transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> {t("returnStore")}
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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {t("title").split(" ")[0]}{" "}
            <span className="text-primary-400">
              {t("title").split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p className="text-sm text-base-400">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="glass-panel p-6 md:p-8 rounded-3xl bg-base-950/60 border border-white/5 flex flex-col gap-4">
            <h2 className="text-xl font-black text-white border-b border-white/5 pb-4">
              {t("accountOrder")}
            </h2>
            <p className="text-sm text-base-300">
              <span className="font-bold text-white">{user?.username}</span>
              {user?.email ? ` · ${user.email}` : ""}
            </p>
            <p className="text-sm text-amber-300">{t("noChargeNotice")}</p>
          </div>

          <div className="glass-panel p-6 md:p-8 rounded-3xl bg-base-950/60 border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" size={22} />
              <h2 className="text-xl font-black text-white">
                {t("pendingStatus")}
              </h2>
            </div>
            <p className="text-sm text-base-400">{t("pendingOrderNotice")}</p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl bg-base-900/30 border border-white/5 sticky top-28 flex flex-col gap-6">
            <h2 className="text-xl font-black text-white border-b border-white/5 pb-4">
              {t("orderSummary")}
            </h2>

            {isLoadingQuote || (!quote && !quoteError) ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-primary-400" size={24} />
              </div>
            ) : quote ? (
              <>
                <div className="flex flex-col gap-4 max-h-75 overflow-y-auto hide-scrollbar">
                  {quote.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-xl bg-base-950 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                        <Image
                          src={item.image || "/images/placeholder.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover opacity-80"
                          sizes="64px"
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
                          ${item.lineTotal}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-white/5 text-sm">
                  <div className="flex justify-between items-center text-base-300">
                    <span>{t("subtotal")}</span>
                    <span className="font-bold text-white">
                      ${quote.subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-base-300">
                    <span>{t("tax")}</span>
                    <span className="font-bold text-white">${quote.tax}</span>
                  </div>
                  <div className="flex justify-between items-center text-base-300">
                    <span>{t("shipping")}</span>
                    <span className="font-bold text-emerald-400">
                      {t("free")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-base font-bold text-white">
                    {t("total")}
                  </span>
                  <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    ${quote.total}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-rose-400">
                {quoteError || t("errors.quoteFailed")}
              </p>
            )}

            {quoteError && quote && (
              <p role="alert" className="text-sm text-rose-400">
                {quoteError}
              </p>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isProcessing || isLoadingQuote || !quote}
              className="w-full mt-2 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />{" "}
                  {t("recordingOrder")}
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> {t("placeOrder")}
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-base-500 mt-2">
              {t("noChargeNotice")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
