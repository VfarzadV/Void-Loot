import type { Metadata } from "next";
import { Vazirmatn, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";
import Providers from "./providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const vazirmatn = Vazirmatn({ subsets: ["arabic"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap" });

export const viewport = {
  themeColor: "#aa4fff",
};

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Void Loot",
    description:
      locale === "fa"
        ? "پلتفرم مدرن گیمینگ با قدرت RAWG"
        : "Modern Gaming Platform Powered by RAWG",
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ]
    }
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const direction = locale === "fa" ? "rtl" : "ltr";
  const fontClass =
    locale === "fa" ? vazirmatn.className : spaceGrotesk.className;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Void Loot",
    url: "https://voidloot.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://voidloot.com/en/games?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={`bg-base-950 text-base-50 min-h-screen flex ${fontClass}`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <Toaster theme="dark" position="bottom-right" richColors />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:inset-s-24 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-black"
            >
              {locale === "fa" ? "پرش به محتوای اصلی" : "Skip to main content"}
            </a>
            <Sidebar />
            <div className="flex-1 ms-0 md:ms-20 flex flex-col min-h-screen relative">
              <Navbar />
              <CartDrawer />
              <main
                id="main-content"
                className="grow px-2 md:px-0 pb-20 md:pb-0"
              >
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
