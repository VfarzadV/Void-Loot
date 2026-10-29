import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.products.findMany({
      where: {
        Category: "games",
      },
      take: 8,
    });

    return NextResponse.json(games);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "خطای دیتابیس";
    return NextResponse.json(
      { error: "Failed to fetch trending games", details: errorMessage },
      { status: 500 },
    );
  }
}
