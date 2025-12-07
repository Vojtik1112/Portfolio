import LiquidBackground from "@/components/canvas/LiquidBackground";
import { Loader } from "@/components/Loader";
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
    <html lang="en">
      <body
        className={`${inter.className} h-screen w-screen overflow-hidden bg-black text-white antialiased`}
      >
        <LiquidBackground />
        <Loader />
        {children}
      </body>
    </html>
  );
}
