"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Flame,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  Share2,
  Users,
  Hash,
  Award,
} from "lucide-react";

interface Post {
  id: number;
  author: string;
  avatar: string;
  role: string;
  time: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  comments: number;
  hot: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: "NeonNinja",
    avatar: "https://i.pravatar.cc/150?u=neon",
    role: "Void Knight",
    time: "2 hours ago",
    title: "RTX 5090 Leaked Specs - Is it worth the upgrade?",
    content:
      "Just saw the latest leaks regarding the power draw on the new 50-series cards. Are we really going to need 1200W PSUs just to run this thing? Let me know your thoughts.",
    category: "Hardware",
    tags: ["#GPU", "#NVIDIA", "#PCBuild"],
    upvotes: 342,
    comments: 89,
    hot: true,
  },
  {
    id: 2,
    author: "ShadowHunter99",
    avatar: "https://i.pravatar.cc/150?u=farzad",
    role: "Premium Member",
    time: "5 hours ago",
    title: "LFG: Cyberpunk Co-op Mod - Need 2 more players",
    content:
      "Running the new multiplayer mod on a private server. We need a netrunner and a solo. Mic required. Drop your discord tags below!",
    category: "LFG",
    tags: ["#Cyberpunk", "#Coop", "#LFG"],
    upvotes: 45,
    comments: 12,
    hot: false,
  },
  {
    id: 3,
    author: "PixelQueen",
    avatar: "https://i.pravatar.cc/150?u=pixel",
    role: "Moderator",
    time: "1 day ago",
    title: "Official Void Loot Community Guidelines",
    content:
      "Welcome to the Void! Please read these rules before posting. 1. Be respectful. 2. No piracy links. 3. Use proper flairs for your posts...",
    category: "Announcements",
    tags: ["#Rules", "#Welcome"],
    upvotes: 1205,
    comments: 42,
    hot: true,
  },
];

export default function CommunityPage() {
  const t = useTranslations("community");
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  const CATEGORIES = [
    t("allTopics"),
    t("announcements"),
    t("hardware"),
    t("lfg"),
    t("gameReviews"),
    t("support"),
  ];

  const filteredPosts = MOCK_POSTS.filter((post) => {
    const matchesCategory =
      activeCategory === t("allTopics") ||
      post.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)]">
              <Users size={24} className="text-primary-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Void{" "}
              <span className="text-primary-500">
                {t("title").replace("Void ", "")}
              </span>
            </h1>
          </div>
          <p className="text-sm text-base-400 max-w-2xl mt-2">
            {t("subtitle")}
          </p>
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] hover:shadow-[0_0_30px_rgba(170,79,255,0.5)] transition-all shrink-0"
        >
          <Plus size={18} /> {t("createPost")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="relative w-full group">
            <Search
              size={18}
              className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
            />
            <input
              aria-label="Search community posts"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-base-950 border border-base-800 rounded-xl py-3 ps-11 pe-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
            />
          </div>
          <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-4 flex flex-col gap-2">
            <h3 className="text-xs font-black text-base-500 uppercase tracking-widest ps-2 mb-2">
              {t("spaces")}
            </h3>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${
                  activeCategory === cat
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/30 shadow-[inset_0_0_15px_rgba(170,79,255,0.1)]"
                    : "text-base-400 hover:bg-base-900 hover:text-white border border-transparent"
                }`}
              >
                <Hash
                  size={16}
                  className={
                    activeCategory === cat
                      ? "text-primary-400"
                      : "text-base-600"
                  }
                />
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex items-center justify-between bg-base-950/40 p-4 rounded-2xl border border-white/5">
            <div className="flex gap-2">
              <button
                type="button"
                aria-pressed="true"
                className="px-4 py-2 rounded-lg bg-base-900 text-white text-xs font-bold border border-white/10 flex items-center gap-2"
              >
                <Flame size={14} className="text-orange-500" /> {t("hot")}
              </button>
              <button
                type="button"
                aria-pressed="false"
                className="px-4 py-2 rounded-lg text-base-400 hover:bg-base-900 hover:text-white text-xs font-bold transition-colors"
              >
                {t("new")}
              </button>
              <button
                type="button"
                aria-pressed="false"
                className="px-4 py-2 rounded-lg text-base-400 hover:bg-base-900 hover:text-white text-xs font-bold transition-colors"
              >
                {t("top")}
              </button>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-base-400">
              No posts found for this category or search.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="glass-panel bg-base-950/80 rounded-2xl border border-white/5 p-5 md:p-6 transition-all hover:border-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    width={40}
                    height={40}
                    className="rounded-full border border-white/10"
                    unoptimized
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {post.author}
                      </span>
                      {post.role === "Moderator" && (
                        <span className="text-[9px] bg-primary-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-black">
                          MOD
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-base-500 flex items-center gap-2">
                      {post.time}{" "}
                      <span className="w-1 h-1 bg-base-700 rounded-full"></span>{" "}
                      {post.category}
                    </span>
                  </div>
                </div>
                <Link href={`/community/post/${post.id}`}>
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-base-300 leading-relaxed line-clamp-3 mb-4">
                    {post.content}
                  </p>
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-primary-400 bg-primary-900/20 px-2 py-1 rounded-md border border-primary-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    aria-label={`Like ${post.title}; ${post.upvotes} likes`}
                    className="flex items-center gap-1.5 text-base-400 hover:text-primary-400 transition-colors text-xs font-bold bg-base-900/50 px-3 py-1.5 rounded-lg border border-transparent hover:border-primary-500/30"
                  >
                    <ThumbsUp size={16} aria-hidden="true" /> {post.upvotes}
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-base-400 hover:text-white transition-colors text-xs font-bold bg-base-900/50 px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10"
                  >
                    <MessageCircle size={16} /> {post.comments} {t("comments")}
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-base-400 hover:text-white transition-colors text-xs font-bold ms-auto"
                  >
                    <Share2 size={16} /> {t("share")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Award size={18} className="text-yellow-500" />{" "}
              {t("topContributors")}
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  name: "NeonNinja",
                  pts: "12.4k",
                  avatar: "https://i.pravatar.cc/150?u=neon",
                },
                {
                  name: "PixelQueen",
                  pts: "9.2k",
                  avatar: "https://i.pravatar.cc/150?u=pixel",
                },
                {
                  name: "GhostRider",
                  pts: "8.1k",
                  avatar: "https://i.pravatar.cc/150?u=ghost",
                },
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-base-500 w-3">
                      {idx + 1}
                    </span>
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                      unoptimized
                    />
                    <span className="text-sm font-bold text-white">
                      {user.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                    {user.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
