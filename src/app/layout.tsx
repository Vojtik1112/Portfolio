import LiquidBackground from "@/components/canvas/LiquidBackground";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dark Liquid Portfolio",
  description:
    "A showcase of high-end web development with liquid chrome aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <LiquidBackground />
        <Loader />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
