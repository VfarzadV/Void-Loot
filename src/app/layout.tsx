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
          <Sidebar />
          <div className="flex-1 ml-20 flex flex-col min-h-screen relative">
            <Navbar />
            <CartDrawer />
            <main className="grow px-2 md:px-0">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
