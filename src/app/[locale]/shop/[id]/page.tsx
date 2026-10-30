import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Star,
  Cpu,
  Monitor,
  Headphones,
  Gift,
  CheckCircle2,
  AlertCircle,
  Package,
  FileText,
  Settings2,
} from "lucide-react";
import AddToCartFullButton from "@/components/cart/AddToCartFullButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";


async function getProduct(id: number) {
  const product = await prisma.products.findUnique({
    where: { ProductID: id },
  });

  if (!product || product.Category === "games") {
    return null;
  }

  return {
    id: product.ProductID,
    title: product.Title,
    price: Number(product.Price?.toString() || 0),
    image: product.ImageUrl || "/images/placeholder.jpg",
    stock: product.Stock || 0,
    category: product.Category || "uncategorized",
  };
}


async function getRelatedProducts(category: string, excludeId: number) {
  const products = await prisma.products.findMany({
    where: {
      Category: category,
      ProductID: { not: excludeId },
    },
    take: 5,
    orderBy: { ProductID: "desc" },
  });

  return products.map((p) => ({
    id: p.ProductID,
    title: p.Title,
    price: Number(p.Price?.toString() || 0),
    image: p.ImageUrl || "/images/placeholder.jpg",
    category: p.Category || "uncategorized",
  }));
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "hardware":
      return <Cpu size={16} />;
    case "accessories":
      return <Headphones size={16} />;
    case "giftcards":
      return <Gift size={16} />;
    default:
      return <Monitor size={16} />;
  }
};

export default async function ShopDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id,
  );

  
  const rating = (4.5 + (product.id % 5) * 0.1).toFixed(1);
  const reviewsCount = 120 + (product.id % 50) * 3;

  return (
    <div className="w-full flex flex-col pb-24 pt-8 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-4 mb-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> Back to Shop
        </Link>
        <Breadcrumbs />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative w-full aspect-square md:aspect-4/3 rounded-3xl glass-panel bg-base-900/40 border border-white/5 overflow-hidden flex items-center justify-center p-8 lg:p-16 group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,79,255,0.1)_0%,transparent_60%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-contain p-8 lg:p-16 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 relative z-10"
            />

            {product.stock > 0 ? (
              <div className="absolute top-6 inset-s-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold backdrop-blur-md">
                <CheckCircle2 size={14} /> In Stock
              </div>
            ) : (
              <div className="absolute top-6 inset-s-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold backdrop-blur-md">
                <AlertCircle size={14} /> Out of Stock
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/5 bg-base-950 hover:bg-base-900 transition-colors">
              <ShieldCheck size={24} className="text-primary-400" />
              <span className="text-xs font-bold text-base-300">
                2 Year Warranty
              </span>
            </div>
            <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/5 bg-base-950 hover:bg-base-900 transition-colors">
              <Truck size={24} className="text-cyan-400" />
              <span className="text-xs font-bold text-base-300">
                Free Shipping
              </span>
            </div>
            <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/5 bg-base-950 hover:bg-base-900 transition-colors">
              <RotateCcw size={24} className="text-emerald-400" />
              <span className="text-xs font-bold text-base-300">
                14-Day Return
              </span>
            </div>
            <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/5 bg-base-950 hover:bg-base-900 transition-colors">
              <CreditCard size={24} className="text-amber-400" />
              <span className="text-xs font-bold text-base-300">
                Secure Payment
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary-400 bg-primary-500/10 px-3 py-1 rounded-md border border-primary-500/20">
              {getCategoryIcon(product.category)}
              {product.category.replace("-", " ")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-8 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} className="fill-yellow-500" />
              <span className="font-bold text-white ms-1">{rating}</span>
              <span className="text-base-400">({reviewsCount} Reviews)</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1.5 text-base-400">
              <Package size={16} />
              <span>SKU: VLT-{10000 + product.id}</span>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-base-900/60 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex flex-col gap-8 sticky top-24">
            <div className="flex flex-col gap-2">
              <span className="text-base-400 text-sm font-medium uppercase tracking-wider">
                Price
              </span>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xl text-base-500 line-through font-bold mb-1">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            <div className="flex flex-col gap-4">
              <AddToCartFullButton
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                }}
              />
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Key Features
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-base-300">
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-base-500">Condition</span>
                  <span className="font-bold text-white">Brand New</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-base-500">Authenticity</span>
                  <span className="font-bold  text-primary-300">
                    100% Original
                  </span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-base-500">Delivery</span>
                  <span className="font-bold text-white">
                    Instant / Express
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-20 pt-16 border-t border-white/5">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-2">
            <FileText className="text-primary-400" size={24} /> Product Overview
          </h3>
          <div className="glass-panel p-8 rounded-3xl bg-base-900/30 border border-white/5 text-base-300 leading-relaxed space-y-4">
            <p>
              Elevate your experience with the{" "}
              <strong className="text-white">{product.title}</strong>. Designed
              for peak performance and ultimate reliability, this premium
              product ensures you stay ahead of the curve. Whether you are
              upgrading your setup, looking for top-tier accessories, or
              expanding your digital library, this item delivers uncompromising
              quality.
            </p>
            <p>
              Crafted with precision and backed by our trusted Void Loot
              guarantee, every purchase is secure, fast, and designed to
              seamlessly integrate into your gaming or professional ecosystem.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-2">
            <Settings2 className="text-cyan-400" size={24} /> Tech Specs
          </h3>
          <div className="glass-panel p-6 rounded-3xl bg-base-900/30 border border-white/5 flex flex-col gap-0">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-base-500 text-sm">Manufacturer</span>
              <span className="text-white text-sm font-bold">
                Top Tier Brand
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-base-500 text-sm">Category</span>
              <span className="text-white text-sm font-bold capitalize">
                {product.category}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-base-500 text-sm">Model Year</span>
              <span className="text-white text-sm font-bold">2024 / 2025</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-base-500 text-sm">Compatibility</span>
              <span className="text-white text-sm font-bold">Universal</span>
            </div>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-16 border-t border-white/5 flex flex-col gap-8">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-500 rounded-full"></span>{" "}
            Related Products
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {relatedProducts.map((rp) => (
              <Link
                href={`/shop/${rp.id}`}
                key={rp.id}
                className="group flex flex-col gap-4 p-4 rounded-2xl glass-panel bg-base-950 border border-white/5 hover:border-primary-500/50 hover:shadow-[0_10px_30px_rgba(170,79,255,0.1)] transition-all duration-300"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-base-900/50 flex items-center justify-center p-4">
                  <Image
                    src={rp.image}
                    alt={rp.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">
                    {rp.category}
                  </span>
                  <span className="text-sm font-bold text-white line-clamp-2 group-hover:text-primary-300 transition-colors">
                    {rp.title}
                  </span>
                  <span className="text-lg font-black text-white mt-2">
                    ${rp.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
