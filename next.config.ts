import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// @ts-expect-error next-pwa missing types
import withPWAInit from "next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.19.0.1', 'localhost'],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.rawg.io" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "dummyjson.com" },
      { protocol: "https", hostname: "cdn.dummyjson.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "dlcdnwebimgs.asus.com" },
      { protocol: "https", hostname: "media.ldlc.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "gmedia.playstation.com" },
      { protocol: "https", hostname: "compass-ssl.xbox.com" },
      { protocol: "https", hostname: "assets.nintendo.com" },
      { protocol: "https", hostname: "cdn.cloudflare.steamstatic.com" },
    ],
  },
};

export default withPWA(withNextIntl(nextConfig));
