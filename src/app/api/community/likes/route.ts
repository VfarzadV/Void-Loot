import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const likeSchema = z.object({
  postId: z.number().int().positive(),
});

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

    const parsed = likeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_POST_ID" }, { status: 400 });
    }

    const post = await prisma.communityPosts.findUnique({
      where: { PostID: parsed.data.postId },
      select: { PostID: true },
    });
    if (!post) {
      return NextResponse.json({ error: "POST_NOT_FOUND" }, { status: 404 });
    }

    const existing = await prisma.communityPostLikes.findUnique({
      where: {
        PostID_UserID: {
          PostID: parsed.data.postId,
          UserID: user.id,
        },
      },
      select: { PostID: true },
    });

    if (existing) {
      await prisma.communityPostLikes.delete({
        where: {
          PostID_UserID: {
            PostID: parsed.data.postId,
            UserID: user.id,
          },
        },
      });
    } else {
      await prisma.communityPostLikes.create({
        data: { PostID: parsed.data.postId, UserID: user.id },
      });
    }

    const likes = await prisma.communityPostLikes.count({
      where: { PostID: parsed.data.postId },
    });

    return NextResponse.json({ liked: !existing, likes });
  } catch (error) {
    console.error("Toggle community post like error:", error);
    return NextResponse.json({ error: "COMMUNITY_LIKE_FAILED" }, { status: 500 });
  }
}
