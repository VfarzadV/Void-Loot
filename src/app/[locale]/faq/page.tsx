"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Search,
  ChevronDown,
  Package,
  Gamepad2,
  Cloud,
  Shield,
  Headset,
  HelpCircle,
  Mail,
} from "lucide-react";

export default function FAQPage() {
  const t = useTranslations("faq");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState<number | null>(1);

  const FAQ_CATEGORIES = [
    { id: "all", label: t("cats.all"), icon: HelpCircle },
    { id: "orders", label: t("cats.orders"), icon: Package },
    { id: "digital", label: t("cats.digital"), icon: Gamepad2 },
    { id: "cloud", label: t("cats.cloud"), icon: Cloud },
    { id: "security", label: t("cats.security"), icon: Shield },
  ];

  const FAQS = [
    { id: 1, category: "orders", question: t("q1.q"), answer: t("q1.a") },
    { id: 2, category: "digital", question: t("q2.q"), answer: t("q2.a") },
    { id: 3, category: "digital", question: t("q3.q"), answer: t("q3.a") },
    { id: 4, category: "cloud", question: t("q4.q"), answer: t("q4.a") },
    { id: 5, category: "cloud", question: t("q5.q"), answer: t("q5.a") },
    { id: 6, category: "security", question: t("q6.q"), answer: t("q6.a") },
    { id: 7, category: "orders", question: t("q7.q"), answer: t("q7.a") },
  ];

  const filteredFAQs = FAQS.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-300 mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-12 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)] mb-2">
          <HelpCircle size={32} className="text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {t("title")}{" "}
          <span className="text-primary-500 drop-shadow-[0_0_10px_rgba(170,79,255,0.4)]">
            {t("titleHighlight")}
          </span>
        </h1>
        <p className="text-sm text-base-400 max-w-xl">{t("subtitle")}</p>
      </div>

      <div className="relative w-full max-w-2xl mx-auto mb-12 group">
        <Search
          size={20}
          className="absolute inset-s-5 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
        />
        <input
          aria-label="Search frequently asked questions"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full bg-base-950 border border-base-800 rounded-2xl py-4 ps-14 pe-6 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-3">
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 ps-2">
            {t("categoriesTitle")}
          </h3>
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenQuestion(null);
                }}
                aria-pressed={isActive}
                className={`flex items-center gap-3 w-full px-5 py-4 rounded-xl transition-all duration-300 text-sm font-bold ${
                  isActive
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/30 shadow-[inset_0_0_15px_rgba(170,79,255,0.1)]"
                    : "text-base-400 hover:bg-base-900 hover:text-white border border-transparent"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-primary-400" : "text-base-500"}
                />
                {cat.label}
              </button>
            );
          })}
        </aside>

        <div className="grow flex flex-col gap-4 min-h-100">
          {filteredFAQs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center glass-panel bg-base-950/60 rounded-3xl border border-white/5">
              <Search size={48} className="text-base-700 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {t("noResultsTitle")}
              </h3>
              <p className="text-sm text-base-400">{t("noResultsDesc")}</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = openQuestion === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-base-900/50 border-primary-500/30 shadow-[0_5px_20px_rgba(170,79,255,0.1)]"
                      : "bg-base-950/60 border-white/5 hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setOpenQuestion(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-start focus:outline-none"
                  >
                    <span
                      className={`text-sm md:text-base font-bold pe-4 transition-colors ${isOpen ? "text-primary-400" : "text-white"}`}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? "bg-primary-500/20 text-primary-400 rotate-180" : "bg-base-900 text-base-400"}`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  <div
                    id={`faq-answer-${faq.id}`}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-5 md:p-6 pt-0 text-sm text-base-300 leading-relaxed border-t border-white/5 mt-2">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-16 w-full glass-panel bg-linear-to-r from-base-950 via-primary-950/20 to-base-950 border border-primary-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start relative overflow-hidden">
        <div className="absolute inset-e-0 top-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col gap-2 relative z-10">
          <h3 className="text-2xl font-black text-white">
            {t("stillHaveQuestions")}
          </h3>
          <p className="text-sm text-base-400 max-w-md">
            {t("stillHaveQuestionsDesc")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto shrink-0">
          <Link
            href="/support"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-base-900 border border-white/10 hover:border-primary-500 hover:text-primary-400 transition-colors"
          >
            <Mail size={18} /> {t("openTicket")}
          </Link>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm text-white bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all">
            <Headset size={18} /> {t("liveChat")}
          </button>
        </div>
      </div>
    </div>
  );
}
