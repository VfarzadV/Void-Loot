import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.rawg.io" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "dummyjson.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ] as const,
  },
};

export default withPWA(withNextIntl(nextConfig));
