import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Nexus Zone",
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
        <Sidebar />
        <div className="flex-1 ml-20 flex flex-col min-h-screen relative">
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
