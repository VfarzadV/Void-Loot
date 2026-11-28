import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const categorySchema = z.enum([
  "announcements",
  "hardware",
  "lfg",
  "gamereviews",
  "support",
]);

const postSchema = z.object({
  title: z.string().trim().min(3).max(200),
  content: z.string().trim().min(10).max(10000),
  category: categorySchema,
  tags: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
});

interface PostRecord {
  PostID: number;
  Title: string;
  Content: string;
  Category: string;
  Tags: string;
  CreatedAt: Date;
  Users: {
    Username: string;
    Profile: { DisplayName: string | null; AvatarUrl: string | null } | null;
  };
  _count: { Comments: number; Likes: number };
  Likes: Array<{ UserID: number }>;
  Comments?: Array<{
    CommentID: number;
    Content: string;
    CreatedAt: Date;
    Users: {
      Username: string;
      Profile: { DisplayName: string | null; AvatarUrl: string | null } | null;
    };
  }>;
}

function parseTags(tags: string) {
  try {
    const value: unknown = JSON.parse(tags);
    return Array.isArray(value) &&
      value.every((tag) => typeof tag === "string")
      ? value
      : [];
  } catch (error) {
    console.error("Invalid tags stored for community post:", error);
    return [];
  }
}

function serializePost(post: PostRecord) {
  return {
    id: post.PostID,
    title: post.Title,
    content: post.Content,
    category: post.Category,
    tags: parseTags(post.Tags),
    createdAt: post.CreatedAt.toISOString(),
    author: post.Users.Profile?.DisplayName || post.Users.Username,
    avatar: post.Users.Profile?.AvatarUrl || "/images/placeholder.svg",
    likes: post._count.Likes,
    commentsCount: post._count.Comments,
    likedByMe: post.Likes.length > 0,
    comments:
      post.Comments?.map((comment) => ({
        id: comment.CommentID,
        content: comment.Content,
        createdAt: comment.CreatedAt.toISOString(),
        author:
          comment.Users.Profile?.DisplayName || comment.Users.Username,
        avatar:
          comment.Users.Profile?.AvatarUrl || "/images/placeholder.svg",
      })) || [],
  };
}

const postInclude = (userId: number) => ({
  Users: {
    select: {
      Username: true,
      Profile: { select: { DisplayName: true, AvatarUrl: true } },
    },
  },
  _count: { select: { Comments: true, Likes: true } },
  Likes: { where: { UserID: userId }, select: { UserID: true } },
});

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const url = new URL(request.url);
    const postIdParam = url.searchParams.get("postId");
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search")?.trim();
    const userIdForLikeLookup = user?.id ?? -1;

    if (postIdParam) {
      const postId = Number(postIdParam);
      if (!Number.isInteger(postId) || postId < 1) {
        return NextResponse.json({ error: "INVALID_POST_ID" }, { status: 400 });
      }

      const post = await prisma.communityPosts.findUnique({
        where: { PostID: postId },
        include: {
          ...postInclude(userIdForLikeLookup),
          Comments: {
            orderBy: { CreatedAt: "asc" },
            include: {
              Users: {
                select: {
                  Username: true,
                  Profile: { select: { DisplayName: true, AvatarUrl: true } },
                },
              },
            },
          },
        },
      });
      if (!post) {
        return NextResponse.json({ error: "POST_NOT_FOUND" }, { status: 404 });
      }
      return NextResponse.json({ post: serializePost(post) });
    }

    const posts = await prisma.communityPosts.findMany({
      where: {
        ...(category && category !== "all" ? { Category: category } : {}),
        ...(search
          ? {
              OR: [
                { Title: { contains: search } },
                { Content: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { CreatedAt: "desc" },
      take: 100,
      include: postInclude(userIdForLikeLookup),
    });

    return NextResponse.json({ posts: posts.map(serializePost) });
  } catch (error) {
    console.error("Fetch community posts error:", error);
    return NextResponse.json(
      { error: "COMMUNITY_POSTS_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_POST" }, { status: 400 });
    }

    const post = await prisma.communityPosts.create({
      data: {
        UserID: user.id,
        Title: parsed.data.title,
        Content: parsed.data.content,
        Category: parsed.data.category,
        Tags: JSON.stringify(parsed.data.tags),
      },
      include: postInclude(user.id),
    });

    return NextResponse.json(
      { post: serializePost(post) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create community post error:", error);
    return NextResponse.json(
      { error: "COMMUNITY_POST_FAILED" },
      { status: 500 },
    );
  }
}
