"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Hash,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Share2,
  ThumbsUp,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  createdAt: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  likedByMe: boolean;
}

interface PostsResponse {
  posts?: CommunityPost[];
  post?: CommunityPost;
  error?: string;
}

const categoryIds = [
  "announcements",
  "hardware",
  "lfg",
  "gamereviews",
  "support",
] as const;

function getCategoryTranslationKey(category: string) {
  switch (category) {
    case "announcements":
    case "hardware":
    case "lfg":
    case "support":
      return category;
    case "gamereviews":
      return "gameReviews";
    default:
      return "allTopics";
  }
}

export default function CommunityPage() {
  const t = useTranslations("community");
  const locale = useLocale();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likingPostId, setLikingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] =
    useState<(typeof categoryIds)[number]>("hardware");
  const [tags, setTags] = useState("");

  const categories = [
    { id: "all", label: t("allTopics") },
    ...categoryIds.map((id) => ({
      id,
      label: t(getCategoryTranslationKey(id)),
    })),
  ];

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setLoadFailed(false);
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      try {
        const response = await fetch(`/api/community/posts?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = (await response.json()) as PostsResponse;
        if (!response.ok || !data.posts) {
          throw new Error(data.error || "COMMUNITY_POSTS_FAILED");
        }
        setPosts(data.posts);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Load community posts error:", error);
        setLoadFailed(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [activeCategory, searchQuery]);

  const handleCreatePost = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error(t("signInToPost"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      const data = (await response.json()) as PostsResponse;
      if (!response.ok || !data.post) {
        throw new Error(data.error || "COMMUNITY_POST_FAILED");
      }
      const createdPost = data.post;

      if (activeCategory === "all" || activeCategory === createdPost.category) {
        setPosts((current) => [createdPost, ...current]);
      }
      setTitle("");
      setContent("");
      setTags("");
      setIsComposerOpen(false);
      toast.success(t("postCreated"));
    } catch (error) {
      console.error("Create community post error:", error);
      toast.error(t("postCreateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (post: CommunityPost) => {
    if (!isAuthenticated) {
      toast.error(t("signInToPost"));
      return;
    }

    setLikingPostId(post.id);
    try {
      const response = await fetch("/api/community/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      const data = (await response.json()) as {
        liked?: boolean;
        likes?: number;
        error?: string;
      };
      if (!response.ok || typeof data.liked !== "boolean") {
        throw new Error(data.error || "COMMUNITY_LIKE_FAILED");
      }
      const liked = data.liked;
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                likedByMe: liked,
                likes: data.likes ?? item.likes,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Like community post error:", error);
      toast.error(t("likeFailed"));
    } finally {
      setLikingPostId(null);
    }
  };

  const handleShare = async (postId: number) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${locale}/community/post/${postId}`,
      );
      toast.success(t("linkCopied"));
    } catch (error) {
      console.error("Copy community post link error:", error);
      toast.error(t("shareFailed"));
    }
  };

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)]">
              <Users size={24} className="text-primary-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Void <span className="text-primary-500">{t("title").replace("Void ", "")}</span>
            </h1>
          </div>
          <p className="text-sm text-base-400 max-w-2xl mt-2">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (isAuthLoading) return;
            if (!isAuthenticated) {
              toast.error(t("signInToPost"));
              return;
            }
            setIsComposerOpen(true);
          }}
          disabled={isAuthLoading}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm text-white bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(170,79,255,0.3)] transition-all shrink-0 disabled:opacity-60"
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
              aria-label={t("searchPlaceholder")}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-base-950 border border-base-800 rounded-xl py-3 ps-11 pe-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
            />
          </div>

          <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-4 flex flex-col gap-2">
            <h2 className="text-xs font-black text-base-500 uppercase tracking-widest ps-2 mb-2">
              {t("spaces")}
            </h2>
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCategory(item.id)}
                aria-pressed={activeCategory === item.id}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${
                  activeCategory === item.id
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/30 shadow-[inset_0_0_15px_rgba(170,79,255,0.1)]"
                    : "text-base-400 hover:bg-base-900 hover:text-white border border-transparent"
                }`}
              >
                <Hash
                  size={16}
                  className={
                    activeCategory === item.id
                      ? "text-primary-400"
                      : "text-base-600"
                  }
                />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="lg:col-span-6 flex flex-col gap-6" aria-live="polite">
          {isLoading ? (
            <div className="flex justify-center py-20 text-primary-400">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : loadFailed ? (
            <p className="text-center py-20 text-rose-300">{t("loadFailed")}</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-base-400 font-bold glass-panel bg-base-950/40 rounded-2xl border-white/5">
              {t("noPostsFound")}
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="glass-panel bg-base-950/80 rounded-2xl border border-white/5 p-5 md:p-6 transition-all hover:border-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={post.avatar}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    className="rounded-full border border-white/10"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{post.author}</span>
                    <span className="text-xs text-base-500 flex items-center gap-2">
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                      }).format(new Date(post.createdAt))}
                      <span className="w-1 h-1 bg-base-700 rounded-full" />
                      {t(
                        getCategoryTranslationKey(post.category),
                      )}
                    </span>
                  </div>
                </div>
                <Link href={`/community/post/${post.id}`}>
                  <h2 className="text-xl font-bold text-white mb-2 hover:text-primary-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-base-300 leading-relaxed line-clamp-3 mb-4 whitespace-pre-line">
                    {post.content}
                  </p>
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-primary-400 bg-primary-900/20 px-2 py-1 rounded-md border border-primary-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => void handleLike(post)}
                    disabled={likingPostId === post.id}
                    aria-pressed={post.likedByMe}
                    aria-label={`${post.title}: ${post.likes} ${t("likes")}`}
                    className={`flex items-center gap-1.5 transition-colors text-xs font-bold bg-base-900/50 px-3 py-1.5 rounded-lg border ${
                      post.likedByMe
                        ? "text-primary-400 border-primary-500/30"
                        : "text-base-400 border-transparent hover:text-primary-400"
                    }`}
                  >
                    <ThumbsUp size={16} aria-hidden="true" /> {post.likes}
                  </button>
                  <Link
                    href={`/community/post/${post.id}#comments`}
                    className="flex items-center gap-1.5 text-base-400 hover:text-white transition-colors text-xs font-bold"
                  >
                    <MessageCircle size={16} /> {post.commentsCount}{" "}
                    {t("comments")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleShare(post.id)}
                    className="flex items-center gap-1.5 text-base-400 hover:text-white transition-colors text-xs font-bold ms-auto"
                  >
                    <Share2 size={16} /> {t("share")}
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="lg:col-span-3">
          <div className="glass-panel bg-base-950/60 rounded-3xl border border-white/5 p-6">
            <h2 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Users size={18} className="text-primary-500" /> {t("communityPosts")}
            </h2>
            <p className="text-sm text-base-400 leading-relaxed">
              {t("communityPostsDescription")}
            </p>
          </div>
        </aside>
      </div>

      {isComposerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsComposerOpen(false);
          }}
        >
          <form
            onSubmit={handleCreatePost}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-base-950 p-6 md:p-8 shadow-2xl"
            aria-labelledby="community-post-title"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 id="community-post-title" className="text-xl font-black text-white">
                {t("createPostTitle")}
              </h2>
              <button
                type="button"
                aria-label={t("cancel")}
                onClick={() => setIsComposerOpen(false)}
                className="text-base-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-sm font-bold text-base-300">
                {t("postTitle")}
                <input
                  required
                  minLength={3}
                  maxLength={200}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t("postTitlePlaceholder")}
                  className="rounded-xl border border-base-800 bg-base-900 px-4 py-3 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-bold text-base-300">
                {t("postCategory")}
                <select
                  value={category}
                  onChange={(event) => {
                    const selected = categoryIds.find(
                      (id) => id === event.target.value,
                    );
                    if (selected) setCategory(selected);
                  }}
                  className="rounded-xl border border-base-800 bg-base-900 px-4 py-3 text-white outline-none focus:border-primary-500"
                >
                  {categoryIds.map((id) => (
                    <option key={id} value={id}>
                      {t(
                        getCategoryTranslationKey(id),
                      )}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-bold text-base-300">
                {t("postContent")}
                <textarea
                  required
                  minLength={10}
                  maxLength={10000}
                  rows={7}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder={t("postContentPlaceholder")}
                  className="resize-y rounded-xl border border-base-800 bg-base-900 px-4 py-3 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-bold text-base-300">
                {t("postTags")}
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder={t("postTagsPlaceholder")}
                  className="rounded-xl border border-base-800 bg-base-900 px-4 py-3 text-white outline-none focus:border-primary-500"
                />
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-base-300 hover:text-white"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white hover:bg-primary-500 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {t("publishPost")}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
