import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      where: {
        Category: "hardware",
      },
      take: 4,
    });

    return NextResponse.json(products);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "خطای ناشناخته در دیتابیس";
    return NextResponse.json(
      { error: "Failed to fetch hardware", details: errorMessage },
      { status: 500 },
    );
  }
}
