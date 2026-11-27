"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Truck,
  Search,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface TrackedOrder {
  OrderID: number;
  Status: string | null;
  OrderDate: string | null;
  TotalAmount: string | number;
  OrderItems: Array<{
    Quantity: number;
    Products: { Title: string };
  }>;
}

interface OrdersResponse {
  error?: string;
  orders?: TrackedOrder[];
}

export default function TrackingPage() {
  const t = useTranslations("tracking");
  const { isAuthenticated } = useAuthStore();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (event: FormEvent) => {
    event.preventDefault();
    setHasSearched(false);
    setResult(null);

    if (!isAuthenticated) {
      toast.error(t("accountRequired"));
      return;
    }

    const orderId = query.trim().replace(/^VOID[-\s]?/i, "");
    if (!/^\d+$/.test(orderId)) {
      toast.error(t("trackingError"));
      return;
    }

    setHasSearched(true);
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/user/orders?orderId=${encodeURIComponent(orderId)}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as OrdersResponse;
      if (!response.ok) {
        throw new Error(
          response.status === 401 ? "AUTH_REQUIRED" : data.error || "ORDER_FAILED",
        );
      }

      setResult(data.orders?.[0] ?? null);
    } catch (error) {
      console.error("Track order error:", error);
      setHasSearched(false);
      toast.error(
        error instanceof Error && error.message === "AUTH_REQUIRED"
          ? t("accountRequired")
          : t("loadFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const status = result?.Status?.toLowerCase() || "";
  const statusLabel =
    status.includes("cancel")
      ? t("statusCancelled")
      : status.includes("deliver")
        ? t("statusDelivered")
        : status.includes("ship")
          ? t("statusShipped")
          : status.includes("confirm")
            ? t("statusConfirmed")
            : status.includes("process")
              ? t("statusProcessing")
              : status.includes("pending")
                ? t("statusPending")
                : result?.Status || t("statusUnknown");

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-4xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-12 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)] mb-2">
          <Truck size={32} className="text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {t("titlePrefix")}{" "}
          <span className="text-primary-500">{t("titleHighlight")}</span>
        </h1>
        <p className="text-sm text-base-400 max-w-xl">{t("subtitle")}</p>
      </div>

      <form
        onSubmit={handleTrack}
        className="relative w-full max-w-2xl mx-auto mb-16 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative grow group">
          <Search
            size={20}
            className="absolute inset-s-5 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
          />
          <input
            type="text"
            required
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("inputPlaceholder")}
            className="w-full bg-base-950 border border-base-800 rounded-2xl py-4 ps-14 pe-6 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 rounded-2xl font-black text-sm text-white bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all shrink-0 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            t("trackBtn")
          )}
        </button>
      </form>

      {hasSearched && !isLoading && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500">
          {result ? (
            <div className="glass-panel bg-base-950/80 border border-primary-500/30 rounded-3xl p-8 md:p-10 flex flex-col gap-8 shadow-[0_15px_40px_rgba(170,79,255,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-base-400 font-mono">
                    {t("orderId")}:{" "}
                    <strong className="text-white">VOID-{result.OrderID}</strong>
                  </span>
                  <h2 className="text-2xl font-black text-white">
                    {t("trackingDetails")}
                  </h2>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-300 font-bold text-xs w-fit">
                  {statusLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-base-900/50 border border-white/5 p-4">
                  <span className="text-[10px] text-base-500 uppercase tracking-wider font-bold">
                    {t("orderTotal")}
                  </span>
                  <p className="mt-1 text-lg font-black text-white">
                    ${Number(result.TotalAmount).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl bg-base-900/50 border border-white/5 p-4">
                  <span className="text-[10px] text-base-500 uppercase tracking-wider font-bold">
                    {t("orderDate")}
                  </span>
                  <p className="mt-1 text-sm font-bold text-white">
                    {result.OrderDate
                      ? new Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(result.OrderDate))
                      : "—"}
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-2">
                {result.OrderItems.map((item, index) => (
                  <li
                    key={`${result.OrderID}-${index}`}
                    className="flex justify-between gap-4 rounded-xl bg-base-900/40 px-4 py-3 text-sm"
                  >
                    <span className="text-base-200">{item.Products.Title}</span>
                    <span className="text-base-400">× {item.Quantity}</span>
                  </li>
                ))}
              </ul>

            </div>
          ) : (
            <div className="glass-panel bg-base-950/60 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
              <AlertCircle size={48} className="text-rose-500 mb-2" />
              <h3 className="text-xl font-bold text-white">{t("notFound")}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
