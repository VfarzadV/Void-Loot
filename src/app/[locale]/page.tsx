import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import Genres from "@/components/home/Genres";
import TrendingGames from "@/components/home/TrendingGames";
import GlobalNetwork from "@/components/sections/GlobalNetwork";

const FeaturedGame = dynamic(() => import("@/components/home/FeaturedGame"));
const ShopCategories = dynamic(() => import("@/components/home/ShopCategories"));
const PopularHardware = dynamic(() => import("@/components/home/PopularHardware"));
const FlashSale = dynamic(() => import("@/components/home/FlashSale"));
const PlatformShowcase = dynamic(() => import("@/components/home/PlatformShowcase"));
const BrandsRow = dynamic(() => import("@/components/home/BrandsRow"));
const GiftCards = dynamic(() => import("@/components/home/GiftCards"));
const GamingNews = dynamic(() => import("@/components/home/GamingNews"));
const StoreFeatures = dynamic(() => import("@/components/home/StoreFeatures"));
const LaserDivider = dynamic(() => import("@/components/home/LaserDivider"));
const ParallaxBanner = dynamic(() => import("@/components/home/ParallaxBanner"));

export default function Home() {
  return (
    <div className="flex flex-col w-full pb-12 gap-y-20 pt-4 overflow-x-hidden">
      <Hero
        slugs={[
          "red-dead-redemption-2",
          "the-last-of-us-part-2",
          "god-of-war-ragnarok",
        ]}
      />
      <Genres />
      <LaserDivider />
      <TrendingGames />
      <LaserDivider />
      <FeaturedGame slug="cyberpunk-2077" />
      <LaserDivider />
      <ShopCategories />
      <ParallaxBanner />
      <PopularHardware />
      <FlashSale />
      <LaserDivider />
      <PlatformShowcase
        platformId={2}
        title="PlayStation Hits"
        icon="playstation"
      />
      <PlatformShowcase platformId={1} title="PC Master Race" icon="pc" />
      <LaserDivider />
      <BrandsRow />
      <GiftCards />
      <LaserDivider />
      <GamingNews />
      <StoreFeatures />
      <GlobalNetwork />
    </div>
  );
}