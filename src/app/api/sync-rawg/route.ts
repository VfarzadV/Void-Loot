import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RAWG API Key is missing in .env" },
      { status: 400 },
    );
  }

  try {
    const games = await prisma.products.findMany({
      where: {
        Category: "games",
      },
    });

    const updatedGames = [];
    const notFoundGames = [];

    for (const game of games) {
      const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(game.Title)}&page_size=1`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const rawgGame = data.results[0];

        if (rawgGame.background_image) {
          await prisma.products.update({
            where: { ProductID: game.ProductID },
            data: { ImageUrl: rawgGame.background_image },
          });

          updatedGames.push({
            title: game.Title,
            image: rawgGame.background_image,
          });
        }
      } else {
        notFoundGames.push(game.Title);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return NextResponse.json({
      message: "Sync completed successfully!",
      updatedCount: updatedGames.length,
      updatedGames,
      notFoundGames,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to sync with RAWG" },
      { status: 500 },
    );
  }
}
