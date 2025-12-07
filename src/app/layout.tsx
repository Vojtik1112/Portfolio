import { Loader } from "@/components/Loader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";

const PhysarumBackground = dynamic(
  () => import("@/components/canvas/PhysarumBackground"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vojta Novak | IT Student & Freelance C++/C# Developer",
  description:
    "Portfolio of Vojta Novak, an IT Student and Freelancer specializing in C++, C#, PHP, and Web Technologies. Available for projects.",
  keywords: [
    "C++",
    "C#",
    "PHP",
    "HTML",
    "CSS",
    "JavaScript",
    "JSON",
    "Freelancer",
    "Vojta Novak",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vojtanovak.vercel.app/",
    title: "Vojta Novak - Genius, Billionaire, Playboy, Philanthropist",
    description:
      "Check out the portfolio of Vojta Novak, IT Student and Freelancer.",
    siteName: "Vojta Novak Portfolio",
    images: [
      {
        url: "https://vojtanovak.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vojta Novak Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vojta Novak | IT Student & Freelancer",
    description: "Genius, Billionaire, Playboy, Philanthropist.",
    creator: "@schizvojta",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vojta Novak",
  url: "https://vojtanovak.vercel.app/",
  jobTitle: "IT Student & Freelancer",
  knowsAbout: ["C++", "C#", "PHP", "Web Development", "JSON"],
  sameAs: [
    "https://github.com/Vojtik1112",
    "https://www.instagram.com/schizvojta/",
  ],
  image: "https://vojtanovak.vercel.app/og-image.jpg",
  description: "Genius, Billionaire, Playboy, Philanthropist.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CZ",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PhysarumBackground />
        <Loader />

        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
