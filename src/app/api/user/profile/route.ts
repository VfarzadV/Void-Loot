import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser, toAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  username: z.string().trim().min(3).max(50),
  avatar: z.string().trim().max(1000),
  banner: z.string().trim().max(1000),
});

export async function PATCH(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { UserID: user.id },
      data: {
        Username: parsed.data.username,
        Profile: {
          upsert: {
            create: {
              DisplayName: parsed.data.name,
              AvatarUrl: parsed.data.avatar || null,
              BannerUrl: parsed.data.banner || null,
            },
            update: {
              DisplayName: parsed.data.name,
              AvatarUrl: parsed.data.avatar || null,
              BannerUrl: parsed.data.banner || null,
            },
          },
        },
      },
      include: { Profile: true },
    });

    return NextResponse.json({ user: toAuthUser(updatedUser) });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
