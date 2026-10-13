"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Headset,
  Send,
  MessageSquare,
  Ticket,
  FileText,
  Package,
} from "lucide-react";
import { toast } from "sonner";

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Ticket submitted successfully! Our drones are on it.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-350 mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-12 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)] mb-4">
          <Headset size={32} className="text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          Support <span className="text-primary-500">Center</span>
        </h1>
        <p className="text-sm text-base-400 max-w-lg">
          Need help with an order, a digital key, or got a technical issue?
          Submit a ticket below and we&apos;ll resolve it at lightspeed.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-8 md:p-10">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Ticket size={24} className="text-primary-500" /> Open a New Ticket
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="john@nexus.com"
                  className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                Category
              </label>
              <select className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none cursor-pointer">
                <option value="order">Order & Shipping</option>
                <option value="tech">Technical Support</option>
                <option value="refund">Returns & Refunds</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-base-400 uppercase tracking-wider ml-1">
                Message
              </label>
              <textarea
                required
                rows={6}
                placeholder="Describe your issue in detail..."
                className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
              />
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Transmitting...</span>
              ) : (
                <>
                  Transmit Message <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
        <aside className="w-full lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel bg-primary-900/10 rounded-3xl border border-primary-500/30 p-8 flex flex-col items-center text-center">
            <MessageSquare size={32} className="text-primary-400 mb-4" />
            <h3 className="text-lg font-black text-white mb-2">Live Chat</h3>
            <p className="text-xs text-base-400 mb-6">
              Our agents are online and ready to assist you in real-time.
            </p>
            <button className="w-full py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-base-200 transition-colors">
              Start Chat
            </button>
          </div>
          <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-3">
              Quick Links
            </h3>
            <Link
              href="/faq"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-900 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-base-900 group-hover:bg-primary-500/20 text-base-400 group-hover:text-primary-400 transition-colors">
                <FileText size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  FAQ / Knowledge Base
                </span>
                <span className="text-[10px] text-base-500">
                  Find answers instantly
                </span>
              </div>
            </Link>
            <Link
              href="/tracking"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-900 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-base-900 group-hover:bg-primary-500/20 text-base-400 group-hover:text-primary-400 transition-colors">
                <Package size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  Order Tracking
                </span>
                <span className="text-[10px] text-base-500">
                  Locate your shipment
                </span>
              </div>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
