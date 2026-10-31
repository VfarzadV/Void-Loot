import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, PackageSearch, Star } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WishlistButton from "@/components/cart/WishlistButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

async function getBrandInfo(slug: string) {
  const brand = await prisma.brands.findUnique({
    where: { Slug: slug },
  });
  return brand;
}

async function getBrandProducts(brandId: number) {
  const products = await prisma.products.findMany({
    where: { BrandID: brandId },
    orderBy: { ProductID: "desc" },
  });

  return products.map((p) => ({
    id: p.ProductID,
    title: p.Title,
    category: p.Category || "hardware",
    price: Number(p.Price?.toString() || 0),
    rating: 4.8,
    thumbnail: p.ImageUrl || "/images/placeholder.jpg",
    availabilityStatus: p.Stock && p.Stock > 0 ? "In Stock" : "Low Stock",
    stock: p.Stock || 0,
  }));
}

export default async function BrandProductsPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const resolvedParams = await params;
  const t = await getTranslations("shop");

  const brand = await getBrandInfo(resolvedParams.slug);

  if (!brand) {
    notFound();
  }

  const products = await getBrandProducts(brand.BrandID);

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-4 mb-8">
        <Link
          href="/brands"
          className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> Back to Brands
        </Link>
        <Breadcrumbs />
      </div>
      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-12 flex items-center justify-between p-8 md:p-12 border border-primary-500/20 bg-base-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(170,79,255,0.1)_0%,transparent_70%)]" />

        <div className="relative z-10 flex items-center gap-6 md:gap-8">
          <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-4 shadow-[0_0_30px_rgba(170,79,255,0.2)] backdrop-blur-md flex items-center justify-center">
            <Image
              src={brand.ImageUrl || "/images/placeholder.jpg"}
              alt={brand.Name}
              fill
              sizes="128px"
              className="object-contain p-4 filter drop-shadow-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-primary-400 text-[10px] md:text-xs font-bold tracking-widest uppercase bg-primary-500/10 px-3 py-1 rounded-md border border-primary-500/20 w-fit">
              Official Partner
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {brand.Name}
            </h1>
            <p className="text-sm text-base-400 mt-1">
              Explore {products.length} products from {brand.Name}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {products.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center text-center glass-panel bg-base-950/40 rounded-3xl border border-white/5">
            <PackageSearch size={48} className="text-base-800 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No products found
            </h3>
            <p className="text-base-400 text-sm">
              We are currently restocking {brand.Name} products. Check back
              soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl glass-panel bg-base-950 transition-all duration-500 hover:-translate-y-2 hover:border-primary-500/50 hover:shadow-[0_10px_40px_rgba(170,79,255,0.15)]"
              >
                <Link
                  href={`/shop/${product.id}`}
                  className="relative w-full aspect-4/3 bg-white/5 flex items-center justify-center p-6 overflow-hidden"
                >
                  <WishlistButton
                    product={{
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.thumbnail,
                    }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,79,255,0.05)_0%,transparent_70%)]" />

                  {product.availabilityStatus === "Low Stock" && (
                    <span className="absolute top-3 inset-s-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-[0_0_15px_rgba(225,29,72,0.5)] z-10 animate-pulse">
                      Low Stock
                    </span>
                  )}

                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover md:object-contain p-0 md:p-4 group-hover:scale-110 transition-transform duration-700 relative z-0 drop-shadow-xl"
                  />
                </Link>

                <div className="p-5 flex flex-col grow gap-2 border-t border-base-800/50">
                  <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                    {product.category.replace("-", " ")}
                  </span>

                  <Link href={`/shop/${product.id}`}>
                    <h3
                      className="text-base font-bold text-base-50 line-clamp-1 group-hover:text-primary-300 transition-colors"
                      title={product.title}
                    >
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-base-400 mt-1">
                    <Star
                      size={14}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="font-bold text-white">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-xl font-black text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <AddToCartButton
                      product={{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.thumbnail,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
