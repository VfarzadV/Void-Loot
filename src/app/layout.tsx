import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Void Loot",
  description: "Modern Gaming Platform Powered by RAWG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="bg-base-950 text-base-50 min-h-screen flex">
        <Providers>
          <Toaster theme="dark" position="bottom-right" richColors />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-24 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-black"
          >
            Skip to main content
          </a>
          <Sidebar />
          <div className="flex-1 ml-20 flex flex-col min-h-screen relative">
            <Navbar />
            <CartDrawer />
            <main id="main-content" className="grow px-2 md:px-0">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
