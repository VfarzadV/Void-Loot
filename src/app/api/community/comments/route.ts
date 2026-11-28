import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  postId: z.number().int().positive(),
  content: z.string().trim().min(1).max(5000),
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

    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_COMMENT" }, { status: 400 });
    }

    const postExists = await prisma.communityPosts.findUnique({
      where: { PostID: parsed.data.postId },
      select: { PostID: true },
    });
    if (!postExists) {
      return NextResponse.json({ error: "POST_NOT_FOUND" }, { status: 404 });
    }

    const comment = await prisma.communityComments.create({
      data: {
        PostID: parsed.data.postId,
        UserID: user.id,
        Content: parsed.data.content,
      },
      include: {
        Users: {
          select: {
            Username: true,
            Profile: { select: { DisplayName: true, AvatarUrl: true } },
          },
        },
      },
    });

    return NextResponse.json(
      {
        comment: {
          id: comment.CommentID,
          content: comment.Content,
          createdAt: comment.CreatedAt.toISOString(),
          author: comment.Users.Profile?.DisplayName || comment.Users.Username,
          avatar:
            comment.Users.Profile?.AvatarUrl || "/images/placeholder.svg",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create community comment error:", error);
    return NextResponse.json(
      { error: "COMMUNITY_COMMENT_FAILED" },
      { status: 500 },
    );
  }
}
