import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dbGames = await prisma.products.findMany({
      where: { 
        Category: "games",
        HeroImage: { not: null } 
      },
      take: 3,
      orderBy: { ProductID: "desc" },
    });

    const heroGames = dbGames.map((game) => ({
      id: game.ProductID,
      name: game.Title,
      background_image: game.HeroImage || game.ImageUrl,
      description: game.Description || `تجربه بی‌نظیر بازی ${game.Title} در Void Loot.`,
      meta: game.Metacritic || 90,
      year: game.ReleaseYear || "TBA",
      genre: game.Genre || "Action",
      players: "1M+", 
    }));

    return NextResponse.json(heroGames);
  } catch (error) {
    console.error("Hero API Error:", error);
    return NextResponse.json({ error: "خطا در دریافت دیتا" }, { status: 500 });
  }
}