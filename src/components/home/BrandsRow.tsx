import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function BrandsRow() {
  const t = await getTranslations("home.brandsAndGifts");

  const brands = await prisma.brands.findMany({
    orderBy: { BrandID: "asc" },
  });

  if (brands.length === 0) return null;

  return (
    <section className="w-full px-8 lg:px-16 relative z-10">
      <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-3">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          {t("shopByBrand").split(" ")[0]}{" "}
          <span className="text-primary-400">
            {t("shopByBrand").split(" ").slice(1).join(" ")}
          </span>
        </h2>
        <Link
          href="/brands"
          className="hidden md:flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-xs font-bold tracking-wider uppercase transition-colors group"
        >
          {t("viewAll")}{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-6 md:justify-between items-center py-4">
        {brands.map((brand) => (
          <Link
            key={brand.BrandID}
            href={`/shop/brand/${brand.Slug}`}
            className="flex flex-col items-center gap-4 group min-w-25"
          >
            <div className="relative w-24 h-24 rounded-full bg-base-950 border-2 border-primary-500/30 flex items-center justify-center transition-all duration-500 group-hover:border-primary-500 group-hover:shadow-[0_0_25px_rgba(170,79,255,0.4)] group-hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              <Image
                src={brand.ImageUrl || "/images/placeholder.jpg"}
                alt={brand.Name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover z-10 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="text-xs font-bold text-base-300 uppercase tracking-widest group-hover:text-white transition-colors">
              {brand.Name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
