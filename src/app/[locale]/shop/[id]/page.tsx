import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gamepad2,
} from "lucide-react";
import AddToCartFullButton from "@/components/cart/AddToCartFullButton";
import WishlistButton from "@/components/cart/WishlistButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

interface ProductDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];
}

async function getProductDetails(id: string) {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const tDetails = await getTranslations("shopDetails");
  const product: ProductDetail = await getProductDetails(id);

  if (!product) {
    notFound();
  }

  const salePrice = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2);

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto overflow-hidden">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-base-400 hover:text-white transition-colors text-sm w-fit mb-8 bg-base-950 px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
      </Link>
      <Breadcrumbs />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-square md:aspect-4/3 rounded-3xl bg-base-950 border border-white/5 flex items-center justify-center p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,79,255,0.08)_0%,transparent_70%)] pointer-events-none" />
            <WishlistButton
              product={{
                id: product.id,
                title: product.title,
                price: parseFloat(salePrice),
                image: product.images[0],
              }}
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-6 inset-s-6 bg-rose-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.5)] z-10 animate-bounce">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              unoptimized
              className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 relative z-0 drop-shadow-2xl"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {product.images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 shrink-0 rounded-2xl bg-base-950 border border-white/5 p-2 cursor-pointer hover:border-primary-500/50 transition-colors"
                >
                  <Image
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 border-b border-white/5 pb-6">
            <div className="flex items-center gap-2 text-primary-400 text-[10px] font-bold tracking-widest uppercase">
              <span className="px-2.5 py-1 rounded bg-primary-500/10 border border-primary-500/20">
                {product.brand}
              </span>
              <span className="text-base-500">|</span>
              <span>{product.category.replace("-", " ")}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-sm bg-base-900 px-3 py-1.5 rounded-lg border border-white/5">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-white">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                  product.stock > 10
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {product.stock > 10
                  ? tDetails("inStock")
                  : tDetails("outOfStock")}
              </span>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-black text-primary-400 drop-shadow-md">
              ${salePrice}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-lg text-base-500 line-through font-bold pb-1">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-sm text-base-300 leading-relaxed">
            {product.description}
          </p>
          <div className="pt-4 mt-2">
            <AddToCartFullButton
              product={{
                id: product.id,
                title: product.title,
                price: parseFloat(salePrice),
                image: product.images[0],
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-2 border-t border-white/5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-base-950 border border-white/5">
              <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {tDetails("safeCheckout")}
                </span>
                <span className="text-[10px] text-base-400">
                  {tDetails("safeCheckoutDesc")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-base-950 border border-white/5">
              <Truck size={24} className="text-blue-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {tDetails("worldwideShipping")}
                </span>
                <span className="text-[10px] text-base-400">
                  {tDetails("worldwideShippingDesc")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-base-950 border border-white/5">
              <RotateCcw size={24} className="text-purple-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {tDetails("freeReturns")}
                </span>
                <span className="text-[10px] text-base-400">
                  {tDetails("freeReturnsDesc")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-base-950 border border-white/5">
              <Gamepad2 size={24} className="text-rose-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {tDetails("support247")}
                </span>
                <span className="text-[10px] text-base-400">
                  {tDetails("support247Desc")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
