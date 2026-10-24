import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      take: 4,
      orderBy: {
        Price: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "خطای دیتابیس";

    return NextResponse.json(
      { error: "Failed to fetch flash sale", details: errorMessage },
      { status: 500 },
    );
  }
}
