import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 },
    );
  }
}
