import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().email().max(100),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  try {
    await prisma.users.create({
      data: {
        Username: username,
        Email: email,
        PasswordHash: await hashPassword(password),
        Profile: {
          create: {
            DisplayName: username,
            AvatarUrl: "/android-chrome-192x192.png",
          },
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;
      const usernameConflict = Array.isArray(target)
        ? target.some((field) => String(field).toLowerCase().includes("username"))
        : String(target ?? "")
            .toLowerCase()
            .includes("username");
      return NextResponse.json(
        {
          error: usernameConflict
            ? "Username already registered"
            : "Email already registered",
          code: usernameConflict ? "USERNAME_IN_USE" : "EMAIL_IN_USE",
        },
        { status: 409 },
      );
    }

    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
