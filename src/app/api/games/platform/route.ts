import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platformId = searchParams.get("id");

  try {
    let keywords = [];
    if (platformId === "2") {
      keywords = [
        "God of War",
        "Spider-Man",
        "Tsushima",
        "Last of Us",
        "Bloodborne",
        "Horizon",
      ];
    } else {
      keywords = [
        "Cyberpunk",
        "Red Dead",
        "Elden",
        "Baldur",
        "Starfield",
        "Doom",
      ];
    }

    const games = await prisma.products.findMany({
      where: {
        Category: "games",
        OR: keywords.map((keyword) => ({
          Title: { contains: keyword },
        })),
      },
      take: 12,
    });

    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch platform games" },
      { status: 500 },
    );
  }
}
