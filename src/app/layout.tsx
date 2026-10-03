import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Nexus Zone",
  description: "Modern Gaming Platform",
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
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
