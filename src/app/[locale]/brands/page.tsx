import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Hexagon, ArrowRight, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

interface Brand {
  BrandID: number;
  Name: string;
  Slug: string;
  ImageUrl: string | null;
}

async function getBrands(): Promise<Brand[]> {
  const brands = await prisma.brands.findMany({
    orderBy: { Name: "asc" },
  });
  return brands as Brand[];
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="w-full flex flex-col pb-24 pt-8 px-6 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col gap-4 mb-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> Back to Home
        </Link>
        <Breadcrumbs />
      </div>
      <div className="relative w-full rounded-3xl overflow-hidden mb-12 flex flex-col items-center text-center p-12 md:p-20 border border-primary-500/20 bg-base-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(170,79,255,0.15)_0%,transparent_70%)]" />
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary-500 to-transparent opacity-50" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(170,79,255,0.3)]">
            <Hexagon
              size={32}
              className="text-primary-400 animate-pulse"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Our Premium{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-cyan-400">
              Partners
            </span>
          </h1>
          <p className="text-base text-base-400 leading-relaxed">
            Discover our curated selection of industry-leading brands. From
            high-performance gaming gear to next-gen hardware, we only partner
            with the best in the void.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-base-300">
              <ShieldCheck size={18} className="text-emerald-400" /> 100%
              Authentic
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-base-300">
              <Zap size={18} className="text-amber-400" /> Official Warranty
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 relative z-10">
        {brands.map((brand: Brand) => (
          <Link
            key={brand.BrandID}
            href={`/shop/brand/${brand.Slug}`}
            className="group relative flex flex-col items-center justify-center gap-4 p-6 rounded-3xl glass-panel bg-base-950/60 border border-white/5 hover:border-primary-500/50 hover:bg-base-900/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(170,79,255,0.15)]"
          >
            <div className="absolute inset-0 bg-linear-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

            <div className="relative w-full aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-6 overflow-hidden group-hover:border-primary-500/30 transition-colors">
              <Image
                src={brand.ImageUrl || "/images/placeholder.jpg"}
                alt={brand.Name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                className="object-contain p-6 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg"
              />
            </div>

            <div className="flex flex-col items-center gap-1 mt-2">
              <span className="text-sm font-black text-white group-hover:text-primary-300 transition-colors tracking-wide">
                {brand.Name}
              </span>
              <span className="text-[10px] font-bold text-base-500 uppercase tracking-widest flex items-center gap-1 group-hover:text-primary-400 transition-colors">
                Explore <ArrowRight size={10} className="rtl:-scale-x-100" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
