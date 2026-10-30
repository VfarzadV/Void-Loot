import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // مپ کردن اسلاگ برندها به دامنه اصلی سایتشون برای Clearbit API
    const domainMap: Record<string, string> = {
      hyperx: "hyperx.com",
      rog: "rog.asus.com",
      razer: "razer.com",
      logitech: "logitech.com",
      steelseries: "steelseries.com",
      coolermaster: "coolermaster.com",
      omen: "omen.com",
      aorus: "aorus.com",
      xbox: "xbox.com",
      playstation: "playstation.com",
      nvidia: "nvidia.com",
      amd: "amd.com",
      intel: "intel.com",
      asus: "asus.com",
    };

    // گرفتن تمام برندها از دیتابیس خودمون
    const brands = await prisma.brands.findMany();
    let updatedCount = 0;

    for (const brand of brands) {
      const domain = domainMap[brand.Slug];

      if (domain) {
        // آدرس مستقیم API برای گرفتن لوگو
        const apiUrl = `https://icon.horse/icon/${domain}`;

        await prisma.brands.update({
          where: { BrandID: brand.BrandID },
          data: { ImageUrl: apiUrl },
        });

        updatedCount++;
      }
    }

    return NextResponse.json({
      message: "عملیات سینک برندها با موفقیت انجام شد! 😎",
      updatedCount: updatedCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطا در سینک کردن برندها" },
      { status: 500 },
    );
  }
}
