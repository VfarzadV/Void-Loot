import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = (searchParams.get("q") || "").trim();
    const limitParam = parseInt(searchParams.get("limit") || "8", 10);
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 30)
        : 8;

    if (!rawQuery) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const results = await prisma.products.findMany({
      where: {
        OR: [
          { Title: { contains: rawQuery } },
          { Category: { contains: rawQuery } },
          { Description: { contains: rawQuery } },
        ],
      },
      take: limit,
      orderBy: [{ Metacritic: "desc" }, { ProductID: "asc" }],
    });

    return NextResponse.json({
      query: rawQuery,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}
