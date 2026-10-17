import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";
import Providers from "./providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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
        ? "فروشگاه و پلتفرم جامع بازی و تجهیزات گیمینگ"
        : "Modern Gaming Platform Powered by RAWG",
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

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className="bg-base-950 text-base-50 min-h-screen flex"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <Toaster theme="dark" position="bottom-right" richColors />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-24 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-black"
            >
              {locale === "fa" ? "رفتن به محتوای اصلی" : "Skip to main content"}
            </a>
            <Sidebar />
            <div className="flex-1 ms-20 flex flex-col min-h-screen relative">
              <Navbar />
              <CartDrawer />
              <main id="main-content" className="grow px-2 md:px-0">
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
