import Hero from "@/components/home/Hero";
import Genres from "@/components/home/Genres";
import TrendingGames from "@/components/home/TrendingGames";
import FeaturedGame from "@/components/home/FeaturedGame";
import ShopCategories from "@/components/home/ShopCategories";
import PopularHardware from "@/components/home/PopularHardware";
import FlashSale from "@/components/home/FlashSale";
import PlatformShowcase from "@/components/home/PlatformShowcase";
import BrandsRow from "@/components/home/BrandsRow";
import GiftCards from "@/components/home/GiftCards";
import GamingNews from "@/components/home/GamingNews";
import StoreFeatures from "@/components/home/StoreFeatures";

export default function Home() {
  return (
    <div className="flex flex-col w-full pb-20">
      <Hero
        slugs={[
          "red-dead-redemption-2",
          "the-last-of-us-part-2",
          "god-of-war-ragnarok",
        ]}
      />
      <Genres />
      <TrendingGames />
      <FeaturedGame slug="cyberpunk-2077" />
      <ShopCategories />
      <PopularHardware />
      <FlashSale />
      <PlatformShowcase
        platformId={2}
        title="PlayStation Hits"
        icon="playstation"
      />
      <PlatformShowcase platformId={1} title="PC Master Race" icon="pc" />
      <BrandsRow />
      <GiftCards />
      <GamingNews />
      <StoreFeatures />
    </div>
  );
}
