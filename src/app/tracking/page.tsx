"use client";
import { useState } from "react";
import {
  Package,
  Search,
  MapPin,
  Truck,
  CheckCircle2,
  Box,
} from "lucide-react";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<boolean>(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setIsSearching(true);
    setTrackingResult(false);
    setTimeout(() => {
      setIsSearching(false);
      setTrackingResult(true);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-300 mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-12 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)] mb-4">
          <Package size={32} className="text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          Track Your <span className="text-primary-500">Loot</span>
        </h1>
        <p className="text-sm text-base-400 max-w-lg">
          Enter your Void Tracking ID or Order Number below to get real-time
          updates on your shipment&apos;s location.
        </p>
      </div>
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
        <form
          onSubmit={handleTrack}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative grow group">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
            />
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              placeholder="e.g. ORD-992-FX"
              className="w-full bg-base-950 border border-base-800 rounded-xl py-4 pl-12 pr-4 text-sm text-white font-mono focus:outline-none focus:border-primary-500 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] uppercase"
            />
          </div>
          <button
            disabled={isSearching}
            type="submit"
            className="px-8 py-4 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all disabled:opacity-50 shrink-0"
          >
            {isSearching ? "Scanning..." : "Track Order"}
          </button>
        </form>
        {trackingResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel bg-base-950/60 rounded-3xl border border-primary-500/20 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-white/5 relative z-10 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-base-500 uppercase tracking-widest">
                  Order ID
                </span>
                <span className="text-xl font-black text-white font-mono">
                  {orderId}
                </span>
              </div>
              <div className="flex flex-col sm:text-right gap-1">
                <span className="text-xs font-bold text-base-500 uppercase tracking-widest">
                  Estimated Delivery
                </span>
                <span className="text-xl font-black text-primary-400">
                  Oct 16, 2026
                </span>
              </div>
            </div>
            <div className="relative flex flex-col gap-8 z-10">
              <div className="absolute left-6 md:left-8 top-2 bottom-2 w-0.5 bg-base-800"></div>
              <div className="flex gap-6 relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary-500/20 border border-primary-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(170,79,255,0.4)] z-10">
                  <CheckCircle2 size={24} className="text-primary-400" />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h4 className="text-base font-bold text-white">
                    Order Confirmed
                  </h4>
                  <p className="text-xs text-base-400">
                    Payment verified and order sent to warehouse.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary-500/20 border border-primary-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(170,79,255,0.4)] z-10">
                  <Box size={24} className="text-primary-400" />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h4 className="text-base font-bold text-white">Processing</h4>
                  <p className="text-xs text-base-400">
                    Your loot is being carefully packed by our drones.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary-500 border border-primary-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(170,79,255,0.6)] z-10">
                  <Truck size={24} className="text-white animate-pulse" />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h4 className="text-base font-bold text-primary-400">
                    In Transit
                  </h4>
                  <p className="text-xs text-base-400">
                    Package has left the facility and is on its way.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-base-900 border border-base-800 flex items-center justify-center shrink-0 z-10">
                  <MapPin size={24} className="text-base-600" />
                </div>
                <div className="flex flex-col justify-center gap-1 opacity-50">
                  <h4 className="text-base font-bold text-white">Delivered</h4>
                  <p className="text-xs text-base-400">
                    Package arrived at destination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
