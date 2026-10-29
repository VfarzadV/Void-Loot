import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const game = await prisma.products.findFirst({
      where: {
        Category: "games",
      },
      orderBy: {
        Price: "desc",
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured game" },
      { status: 500 },
    );
  }
}
