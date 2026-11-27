import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSession,
  ensureUserProfile,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { Username: parsed.data.username },
      include: { Profile: true },
    });

    if (!user || !(await verifyPassword(parsed.data.password, user.PasswordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const authUser = await ensureUserProfile(user);
    const session = await createSession(user.UserID);

    const response = NextResponse.json({ user: authUser });
    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 },
    );
  }
}
