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
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.rawg.io" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "dummyjson.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
};

export default withPWA(withNextIntl(nextConfig));
