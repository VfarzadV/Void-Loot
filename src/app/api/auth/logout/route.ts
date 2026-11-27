import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revokeSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token && /^[A-Za-z0-9_-]{43}$/.test(token)) {
      await revokeSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 },
    );
  }
}
