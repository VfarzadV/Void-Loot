import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Monitor,
  Headphones,
  Cpu,
  Filter,
  Star,
  Laptop,
  Smartphone,
  Gamepad2,
} from "lucide-react";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  thumbnail: string;
  availabilityStatus: string;
}

const CATEGORIES = [
  { name: "All Gear", slug: "all", icon: Cpu },
  { name: "Gaming Laptops", slug: "laptops", icon: Laptop },
  { name: "Tablets & Displays", slug: "tablets", icon: Monitor },
  { name: "Accessories", slug: "mobile-accessories", icon: Headphones },
  { name: "Smartphones", slug: "smartphones", icon: Smartphone },
];

async function getProducts(search?: string, category?: string) {
  let url = "https://dummyjson.com/products/category/laptops?limit=24";
  if (search) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=24`;
  } else if (category && category !== "all") {
    url = `https://dummyjson.com/products/category/${category}?limit=24`;
  } else if (category === "all") {
    const res = await fetch("https://dummyjson.com/products?limit=100");
    if (!res.ok) return null;
    const data = await res.json();
    const techCategories = [
      "laptops",
      "tablets",
      "mobile-accessories",
      "smartphones",
    ];
    const techProducts = data.products.filter((p: Product) =>
      techCategories.includes(p.category),
    );
    return { products: techProducts.slice(0, 24) };
  }

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const currentCategory = params.category || "laptops";

  const data = await getProducts(searchQuery, currentCategory);
  const products: Product[] = data?.products || [];

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Nexus <span className="text-primary-400">Hardware</span>
          </h1>
          <p className="text-sm text-base-400 max-w-xl">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : "Upgrade your setup with premium hardware and tech peripherals powered by API."}
          </p>
        </div>
        <form
          action="/shop"
          method="GET"
          className="relative w-full md:w-80 group"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
          />
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search gear..."
            className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
          />
          {searchQuery && (
            <Link
              href="/shop"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-base-500 hover:text-white"
            >
              Clear
            </Link>
          )}
        </form>
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-wider">
              <Filter size={18} className="text-primary-500" /> Categories
            </h3>
            <ul className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = currentCategory === cat.slug && !searchQuery;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-primary-500/10 text-primary-400 border border-primary-500/30 shadow-[inset_0_0_15px_rgba(170,79,255,0.1)]"
                          : "text-base-400 hover:bg-base-900 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={isActive ? "text-primary-400" : ""}
                        />
                        <span className="text-sm font-bold">{cat.name}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Price Range
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="range"
                min="0"
                max="2000"
                className="w-full accent-primary-500"
              />
              <div className="flex items-center justify-between text-xs font-bold text-base-400 font-mono">
                <span>$0</span>
                <span>$2000+</span>
              </div>
            </div>
          </div>
        </aside>
        <div className="grow flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-400 font-medium">
              Showing <strong className="text-white">{products.length}</strong>{" "}
              products
            </p>
            <select className="bg-base-900 border border-base-800 text-sm text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary-500">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>
          {products.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center text-center">
              <Gamepad2 size={48} className="text-base-800 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Hardware Found
              </h3>
              <p className="text-base-400 text-sm">
                Try adjusting your search or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl glass-panel bg-base-950 transition-all duration-500 hover:-translate-y-2 hover:border-primary-500/50 hover:shadow-[0_10px_40px_rgba(170,79,255,0.15)]"
                >
                  <Link
                    href={`/shop/${product.id}`}
                    className="relative w-full aspect-4/3 bg-white/5 flex items-center justify-center p-6 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,79,255,0.05)_0%,transparent_70%)]" />
                    {product.availabilityStatus === "Low Stock" && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-[0_0_15px_rgba(225,29,72,0.5)] z-10 animate-pulse">
                        Low Stock
                      </span>
                    )}
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      unoptimized
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 relative z-0 drop-shadow-xl"
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
                      <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-base-900 border border-white/10 text-base-300 transition-all hover:bg-primary-600 hover:text-white hover:border-primary-500 hover:shadow-[0_0_15px_rgba(170,79,255,0.4)] group/btn">
                        <ShoppingBag
                          size={18}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
