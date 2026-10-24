import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const giftcards = await prisma.products.findMany({
      where: {
        Category: "giftcards",
      },
      take: 4,
    });

    return NextResponse.json(giftcards);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "خطای دیتابیس";

    return NextResponse.json(
      { error: "Failed to fetch gift cards", details: errorMessage },
      { status: 500 },
    );
  }
}
