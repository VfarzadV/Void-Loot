import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { getTranslations } from "next-intl/server";
import {
  Search,
  Monitor,
  Headphones,
  Cpu,
  Filter,
  Star,
  Laptop,
  Smartphone,
  Gamepad2,
  LucideIcon,
} from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WishlistButton from "@/components/cart/WishlistButton";
import SortDropdown from "@/components/shop/SortDropdown";
import PriceFilter from "@/components/shop/PriceFilter";
import Pagination from "@/components/shared/Pagination";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  thumbnail: string;
  availabilityStatus: string;
  stock: number;
}

type CategoryTranslationKey =
  | "cats.all"
  | "cats.laptops"
  | "cats.tablets"
  | "cats.accessories"
  | "cats.smartphones";

interface CategoryConfig {
  labelKey: CategoryTranslationKey;
  slug: string;
  icon: LucideIcon;
}

const CATEGORIES: CategoryConfig[] = [
  { labelKey: "cats.all", slug: "all", icon: Cpu },
  { labelKey: "cats.laptops", slug: "laptops", icon: Laptop },
  { labelKey: "cats.tablets", slug: "tablets", icon: Monitor },
  {
    labelKey: "cats.accessories",
    slug: "mobile-accessories",
    icon: Headphones,
  },
  { labelKey: "cats.smartphones", slug: "smartphones", icon: Smartphone },
];

async function getProducts(search?: string, category?: string) {
  const techCategories = [
    "laptops",
    "tablets",
    "mobile-accessories",
    "smartphones",
  ];

  if ((!category || category === "all") && !search) {
    const endpoints = techCategories.map(
      (cat) => `https://dummyjson.com/products/category/${cat}?limit=50`,
    );
    const responses = await Promise.all(
      endpoints.map((url) =>
        fetch(url, { next: { revalidate: 3600 } }).then((res) => res.json()),
      ),
    );
    let allTechProducts: Product[] = [];
    responses.forEach((res) => {
      if (res && res.products) {
        allTechProducts = [...allTechProducts, ...res.products];
      }
    });
    return allTechProducts;
  }

  let url = "https://dummyjson.com/products?limit=150";

  if (search) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=150`;
  } else if (category && category !== "all") {
    url = `https://dummyjson.com/products/category/${category}?limit=50`;
  }

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();

  let fetchedProducts = data.products;

  if (search) {
    fetchedProducts = fetchedProducts.filter((p: Product) =>
      techCategories.includes(p.category),
    );
  }

  return fetchedProducts;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const currentCategory = params.category || "all";
  const currentSort = params.sort || "";
  const maxPrice = Number(params.maxPrice) || 2000;
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 12;

  const t = await getTranslations("shop");

  let products: Product[] =
    (await getProducts(searchQuery, currentCategory)) || [];

  if (maxPrice < 2000) {
    products = products.filter((p) => p.price <= maxPrice);
  }

  if (currentSort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating-desc") {
    products.sort((a, b) => b.rating - a.rating);
  }

  const totalItems = products.length;
  const pageCount = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {t("titlePrefix")}{" "}
            <span className="text-primary-400">{t("titleHighlight")}</span>
          </h1>
          <p className="text-sm text-base-400 max-w-xl">
            {searchQuery
              ? t("subtitleSearch", { query: searchQuery })
              : t("subtitleDefault")}
          </p>
        </div>

        <Form
          action="/shop"
          aria-label="Search hardware"
          className="relative w-full md:w-80 group"
        >
          {currentCategory !== "all" && (
            <input type="hidden" name="category" value={currentCategory} />
          )}
          {currentSort && (
            <input type="hidden" name="sort" value={currentSort} />
          )}
          {maxPrice < 2000 && (
            <input type="hidden" name="maxPrice" value={maxPrice} />
          )}
          <Search
            size={18}
            className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-base-500 group-focus-within:text-primary-400 transition-colors"
          />
          <input
            type="text"
            aria-label="Search hardware"
            name="search"
            defaultValue={searchQuery}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-base-900/50 border border-base-800 rounded-xl py-3 ps-11 pe-4 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500 focus:bg-base-900 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
          />
          {searchQuery && (
            <Link
              href={`/shop?category=${currentCategory}${currentSort ? `&sort=${currentSort}` : ""}${maxPrice < 2000 ? `&maxPrice=${maxPrice}` : ""}`}
              className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-xs text-base-500 hover:text-white"
            >
              {t("clear")}
            </Link>
          )}
        </Form>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-wider">
              <Filter size={18} className="text-primary-500" />{" "}
              {t("categories")}
            </h3>
            <ul className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = currentCategory === cat.slug;
                const categoryUrl = `/shop?category=${cat.slug}${searchQuery ? `&search=${searchQuery}` : ""}${currentSort ? `&sort=${currentSort}` : ""}${maxPrice < 2000 ? `&maxPrice=${maxPrice}` : ""}`;

                return (
                  <li key={cat.slug}>
                    <Link
                      href={categoryUrl}
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
                        <span className="text-sm font-bold">
                          {t(cat.labelKey)}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between">
              {t("priceRange")}
              {maxPrice < 2000 && (
                <Link
                  href={`/shop?category=${currentCategory}${searchQuery ? `&search=${searchQuery}` : ""}${currentSort ? `&sort=${currentSort}` : ""}`}
                  className="text-[10px] text-primary-400 hover:text-white normal-case"
                >
                  {t("reset")}
                </Link>
              )}
            </h3>
            <PriceFilter />
          </div>
        </aside>

        <div className="grow flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-base-400 font-medium">
              {t("showing")}{" "}
              <strong className="text-white">{products.length}</strong>{" "}
              {t("products")}
            </p>
            <SortDropdown />
          </div>

          {products.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center text-center">
              <Gamepad2 size={48} className="text-base-800 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {t("noHardwareTitle")}
              </h3>
              <p className="text-base-400 text-sm">{t("noHardwareDesc")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
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
                        {t("lowStock")}
                      </span>
                    )}
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

          {totalItems > ITEMS_PER_PAGE && <Pagination pageCount={pageCount} />}
        </div>
      </div>
    </div>
  );
}
