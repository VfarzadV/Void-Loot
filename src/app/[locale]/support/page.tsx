"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  LifeBuoy,
  MessageSquare,
  MessageCircle,
  Mail,
  FileText,
  Send,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function SupportPage() {
  const t = useTranslations("support");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t("ticketSuccess"));
      setSubject("");
      setCategory("");
      setMessage("");
    }, 1500);
  };

  const CONTACT_METHODS = [
    {
      id: "chat",
      icon: MessageSquare,
      title: t("liveChat"),
      desc: t("liveChatDesc"),
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50",
      href: "#",
    },
    {
      id: "discord",
      icon: MessageCircle,
      title: t("discord"),
      desc: t("discordDesc"),
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50",
      href: "#",
    },
    {
      id: "email",
      icon: Mail,
      title: t("emailUs"),
      desc: t("emailUsDesc"),
      color: "text-primary-400",
      bg: "bg-primary-500/10 border-primary-500/20 hover:border-primary-500/50",
      href: "mailto:support@voidloot.com",
    },
    {
      id: "faq",
      icon: FileText,
      title: t("faqSection"),
      desc: t("faqDesc"),
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/50",
      href: "/faq",
    },
  ];

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-16 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)] mb-2">
          <LifeBuoy size={32} className="text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {t("titlePrefix")}{" "}
          <span className="text-primary-500">{t("titleHighlight")}</span>
        </h1>
        <p className="text-sm text-base-400 max-w-2xl">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start max-w-6xl mx-auto w-full">
        <div className="lg:col-span-5 flex flex-col gap-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <MessageSquare size={24} className="text-primary-500" />{" "}
            {t("contactMethods")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {CONTACT_METHODS.map((method) => (
              <Link
                key={method.id}
                href={method.href}
                className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${method.bg}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-base-950 shadow-inner ${method.color}`}
                >
                  <method.icon size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-xs text-base-400 font-medium leading-relaxed">
                    {method.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 w-full glass-panel bg-base-950/60 p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 end-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-8 relative z-10">
            <Send size={24} className="text-primary-500" /> {t("submitTicket")}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 relative z-10"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="ticket-subject"
                className="text-[11px] font-bold text-base-300 uppercase tracking-wider ms-1"
              >
                {t("ticketSubject")}
              </label>
              <input
                id="ticket-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("subjectPlaceholder")}
                className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="ticket-category"
                className="text-[11px] font-bold text-base-300 uppercase tracking-wider ms-1"
              >
                {t("ticketCategory")}
              </label>
              <div className="relative group">
                <select
                  id="ticket-category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-base-900/50 border border-base-800 rounded-xl py-3.5 ps-4 pe-11 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] cursor-pointer"
                >
                  <option value="" disabled className="bg-base-950">
                    {t("categorySelect")}
                  </option>
                  <option value="account" className="bg-base-950">
                    {t("catAccount")}
                  </option>
                  <option value="payment" className="bg-base-950">
                    {t("catPayment")}
                  </option>
                  <option value="tech" className="bg-base-950">
                    {t("catTech")}
                  </option>
                  <option value="order" className="bg-base-950">
                    {t("catOrder")}
                  </option>
                  <option value="other" className="bg-base-950">
                    {t("catOther")}
                  </option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-base-500 pointer-events-none group-focus-within:text-primary-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="ticket-message"
                className="text-[11px] font-bold text-base-300 uppercase tracking-wider ms-1"
              >
                {t("ticketMessage")}
              </label>
              <textarea
                id="ticket-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                rows={6}
                className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] resize-none"
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="mt-2 group relative w-full sm:w-auto self-end flex justify-center items-center py-4 px-10 border border-transparent text-sm font-black rounded-xl text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all duration-300 disabled:opacity-70 disabled:hover:shadow-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />{" "}
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send size={18} className="rtl:-scale-x-100" />{" "}
                    {t("sendTicket")}
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
