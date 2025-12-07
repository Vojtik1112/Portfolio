import PhysarumBackground from "@/components/canvas/PhysarumBackground";
import { Loader } from "@/components/Loader";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vojta Novak | Creative Developer",
  description:
    "Portfolio of Vojta Novak, a creative developer specializing in high-performance web interfaces.",
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
        <PhysarumBackground />
        <Loader />
        {children}
      </body>
    </html>
  );
}
