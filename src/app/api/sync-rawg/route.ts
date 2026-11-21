import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RAWG API Key is missing in .env" },
      { status: 400 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");
    const onlyMissing = searchParams.get("missing") === "true";

    const whereClause: {
      Category: string;
      ProductID?: { in: number[] };
      ImageUrl?: null;
    } = {
      Category: "games",
    };

    if (idsParam) {
      const ids = idsParam
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      if (ids.length > 0) {
        whereClause.ProductID = { in: ids };
      }
    } else if (onlyMissing) {
      whereClause.ImageUrl = null;
    }

    const games = await prisma.products.findMany({
      where: whereClause,
    });

    const updatedGames = [];
    const notFoundGames = [];
    const failedGames = [];

    for (const game of games) {
      try {
        const cleanTitle = game.Title.replace(/[?]/g, "o");
        const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(cleanTitle)}&page_size=1`;

        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          failedGames.push({ title: game.Title, status: res.status });
          continue;
        }

        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const rawgGame = data.results[0];
          if (rawgGame.background_image) {
            const isHeroTarget =
              idsParam !== null || [18, 23, 39].includes(game.ProductID);

            await prisma.products.update({
              where: { ProductID: game.ProductID },
              data: {
                ImageUrl: rawgGame.background_image,
                ...(isHeroTarget && { HeroImage: rawgGame.background_image }),
              },
            });

            updatedGames.push({
              id: game.ProductID,
              title: game.Title,
              image: rawgGame.background_image,
            });
          }
        } else {
          notFoundGames.push(game.Title);
        }
      } catch (innerError) {
        failedGames.push({
          title: game.Title,
          error:
            innerError instanceof Error ? innerError.message : "Fetch failed",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    return NextResponse.json({
      message: "Sync process finished!",
      updatedCount: updatedGames.length,
      updatedGames,
      notFoundGames,
      failedGames,
    });
  } catch (error) {
    console.error("RAWG Sync Error:", error);
    return NextResponse.json(
      {
        error: "Failed to sync with RAWG",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
