import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import Hero from "@/components/home/Hero";
import Genres from "@/components/home/Genres";
import TrendingGames from "@/components/home/TrendingGames";
import GlobalNetwork from "@/components/sections/GlobalNetwork";
import ScrollReveal from "@/components/shared/ScrollReveal";

const FeaturedGame = dynamic(() => import("@/components/home/FeaturedGame"));
const ShopCategories = dynamic(
  () => import("@/components/home/ShopCategories"),
);
const PopularHardware = dynamic(
  () => import("@/components/home/PopularHardware"),
);
const FlashSale = dynamic(() => import("@/components/home/FlashSale"));
const PlatformShowcase = dynamic(
  () => import("@/components/home/PlatformShowcase"),
);
const BrandsRow = dynamic(() => import("@/components/home/BrandsRow"));
const GiftCards = dynamic(() => import("@/components/home/GiftCards"));
const GamingNews = dynamic(() => import("@/components/home/GamingNews"));
const StoreFeatures = dynamic(() => import("@/components/home/StoreFeatures"));
const LaserDivider = dynamic(() => import("@/components/home/LaserDivider"));
const ParallaxBanner = dynamic(
  () => import("@/components/home/ParallaxBanner"),
);

export default  function Home() {
  const t = useTranslations("home.platformShowcase");

  return (
    <div className="flex flex-col w-full pb-12 gap-y-20 pt-4 overflow-x-hidden">
      <Hero
        slugs={[
          "red-dead-redemption-2",
          "the-last-of-us-part-2",
          "god-of-war-ragnarok",
        ]}
      />
      <ScrollReveal animation="fade-up">
        <Genres />
      </ScrollReveal>
      <LaserDivider />
      <ScrollReveal animation="fade-up" delay={0.1}>
        <TrendingGames />
      </ScrollReveal>
      <LaserDivider />
      <ScrollReveal animation="zoom-in">
        <FeaturedGame slug="cyberpunk-2077" />
      </ScrollReveal>
      <LaserDivider />
      <ScrollReveal animation="fade-up">
        <ShopCategories />
      </ScrollReveal>
      <ScrollReveal animation="zoom-in" delay={0.1}>
        <ParallaxBanner />
      </ScrollReveal>
      <ScrollReveal animation="fade-up">
        <PopularHardware />
      </ScrollReveal>
      <ScrollReveal animation="fade-up">
        <FlashSale />
      </ScrollReveal>
      <LaserDivider />
      <ScrollReveal animation="fade-right">
        <PlatformShowcase
          platformId={2}
          title={t("playstationTitle")}
          icon="playstation"
        />
      </ScrollReveal>
      <ScrollReveal animation="fade-left">
        <PlatformShowcase platformId={1} title={t("pcTitle")} icon="pc" />
      </ScrollReveal>
      <LaserDivider />
      <ScrollReveal animation="fade-up">
        <BrandsRow />
      </ScrollReveal>
      <ScrollReveal animation="zoom-in">
        <GiftCards />
      </ScrollReveal>
      <LaserDivider />
      <ScrollReveal animation="fade-up">
        <GamingNews />
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={0.1}>
        <StoreFeatures />
      </ScrollReveal>
      <ScrollReveal animation="fade-up">
        <GlobalNetwork />
      </ScrollReveal>
    </div>
  );
}
