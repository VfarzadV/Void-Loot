import { NextResponse } from "next/server";
import { getActivePromotions } from "@/lib/promotions";

export async function GET() {
  try {
    return NextResponse.json(await getActivePromotions());
  } catch (error) {
    console.error("Fetch active promotions error:", error);
    return NextResponse.json(
      { error: "PROMOTIONS_FAILED" },
      { status: 500 },
    );
  }
}
