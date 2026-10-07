import Hero from "@/components/home/Hero";
import Genres from "@/components/home/Genres";
import TrendingGames from "@/components/home/TrendingGames";
import FeaturedGame from "@/components/home/FeaturedGame";
import ShopCategories from "@/components/home/ShopCategories";
import PopularHardware from "@/components/home/PopularHardware";
import FlashSale from "@/components/home/FlashSale";

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
    </div>
  );
}
