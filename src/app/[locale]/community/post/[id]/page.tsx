"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Loader2,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface CommunityComment {
  id: number;
  content: string;
  createdAt: string;
  author: string;
  avatar: string;
}

interface CommunityPost {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  author: string;
  avatar: string;
  likes: number;
  commentsCount: number;
  likedByMe: boolean;
  comments: CommunityComment[];
}

const categoryTranslationKeys: Record<string, string> = {
  announcements: "announcements",
  hardware: "hardware",
  lfg: "lfg",
  gamereviews: "gameReviews",
  support: "support",
};

export default function PostDetailsPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const isValidPostId = Number.isInteger(postId) && postId > 0;
  const t = useTranslations("communityPost");
  const community = useTranslations("community");
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (!isValidPostId) return;

    const controller = new AbortController();
    fetch(`/api/community/posts?postId=${postId}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = (await response.json()) as {
          post?: CommunityPost;
          error?: string;
        };
        if (!response.ok || !data.post) {
          throw new Error(data.error || "COMMUNITY_POST_FAILED");
        }
        setPost(data.post);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error("Load community post error:", error);
        setLoadFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [isValidPostId, postId]);

  const handleLike = async () => {
    if (!post) return;
    if (!isAuthenticated) {
      toast.error(community("signInToPost"));
      return;
    }

    setIsLiking(true);
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
      setPost((current) =>
        current
          ? {
              ...current,
              likedByMe: liked,
              likes: data.likes ?? current.likes,
            }
          : current,
      );
    } catch (error) {
      console.error("Like community post error:", error);
      toast.error(community("likeFailed"));
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!post) return;
    if (!isAuthenticated) {
      toast.error(community("signInToPost"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: comment }),
      });
      const data = (await response.json()) as {
        comment?: CommunityComment;
        error?: string;
      };
      if (!response.ok || !data.comment) {
        throw new Error(data.error || "COMMUNITY_COMMENT_FAILED");
      }
      const createdComment = data.comment;
      setPost((current) =>
        current
          ? {
              ...current,
              comments: [...current.comments, createdComment],
              commentsCount: current.commentsCount + 1,
            }
          : current,
      );
      setComment("");
      toast.success(community("commentCreated"));
    } catch (error) {
      console.error("Submit community comment error:", error);
      toast.error(community("commentsFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(community("linkCopied"));
    } catch (error) {
      console.error("Copy community post link error:", error);
      toast.error(community("shareFailed"));
    }
  };

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-300 mx-auto overflow-hidden">
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit mb-6 bg-base-950 px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
        {community("backToCommunity")}
      </Link>

      {!isValidPostId || loadFailed || (!isLoading && !post) ? (
        <div className="rounded-3xl border border-white/5 bg-base-950/60 p-12 text-center flex flex-col items-center gap-4">
          <AlertCircle size={42} className="text-rose-400" />
          <p className="text-white font-bold">{community("postDetailsFailed")}</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-24 text-primary-400">
          <Loader2 className="animate-spin" size={30} />
        </div>
      ) : post ? (
        <>
          <article className="glass-panel bg-base-950/80 rounded-3xl border border-white/5 p-6 md:p-10 mb-8">
            <header className="flex items-center gap-4 border-b border-white/5 pb-6 mb-6">
              <Image
                src={post.avatar}
                alt=""
                width={56}
                height={56}
                unoptimized
                className="rounded-full border-2 border-primary-500/50"
              />
              <div className="flex flex-col gap-1">
                <span className="text-base font-black text-white">
                  {post.author}
                </span>
                <span className="text-xs text-base-500 flex items-center gap-1.5 font-medium">
                  <Clock size={12} />
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(post.createdAt))}
                </span>
              </div>
            </header>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                {community(
                  categoryTranslationKeys[post.category] || "allTopics",
                )}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-snug">
                {post.title}
              </h1>
              <p className="text-sm md:text-base text-base-300 leading-relaxed whitespace-pre-line my-4">
                {post.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-primary-400 bg-primary-900/20 px-2.5 py-1 rounded-md border border-primary-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => void handleLike()}
                  disabled={isLiking}
                  aria-pressed={post.likedByMe}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                    post.likedByMe
                      ? "bg-primary-600 text-white border-primary-500"
                      : "bg-primary-600/20 border-primary-500/40 text-primary-400 hover:bg-primary-500 hover:text-white"
                  }`}
                >
                  <ThumbsUp size={18} /> {post.likes} · {t("like")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-900 border border-white/5 text-base-300 hover:text-white transition-colors text-sm font-bold"
                >
                  <Share2 size={18} /> {t("share")}
                </button>
              </div>
            </div>
          </article>

          <section id="comments" className="flex flex-col gap-6 scroll-mt-24">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <MessageCircle size={20} className="text-primary-500" />
              {t("comments")} ({post.commentsCount})
            </h2>
            {isAuthenticated ? (
              <form
                onSubmit={handleComment}
                className="glass-panel bg-base-950/60 rounded-2xl border border-white/5 p-4 flex flex-col gap-3"
              >
                <label htmlFor="community-comment" className="sr-only">
                  {community("commentPlaceholder")}
                </label>
                <textarea
                  id="community-comment"
                  required
                  maxLength={5000}
                  rows={3}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={community("commentPlaceholder")}
                  className="w-full resize-y rounded-xl border border-base-800 bg-base-900 px-4 py-3 text-sm text-white outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-500 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {community("sendComment")}
                </button>
              </form>
            ) : (
              <p className="rounded-xl border border-white/5 bg-base-950/60 p-4 text-sm text-base-400">
                {community("signInToPost")}
              </p>
            )}

            {post.comments.length === 0 ? (
              <p className="text-sm text-base-400">{community("noComments")}</p>
            ) : (
              <div className="flex flex-col gap-4">
                {post.comments.map((item) => (
                  <article
                    key={item.id}
                    className="glass-panel bg-base-950/60 rounded-2xl border border-white/5 p-4 flex gap-4"
                  >
                    <Image
                      src={item.avatar}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="rounded-full border border-white/10 mt-1"
                    />
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-sm font-bold text-white">
                          {item.author}
                        </span>
                        <span className="text-[10px] text-base-500">
                          {new Intl.DateTimeFormat(locale, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(item.createdAt))}
                        </span>
                      </div>
                      <p className="text-sm text-base-300 whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
