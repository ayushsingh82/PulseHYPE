import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<<< HEAD:frontend/src/app/layout.tsx
  title: "PulseHYPE - Universal DeFi Intelligence & Simulation Platform",
  description: "The fastest, smartest way to swap, stake, farm, analyze, and simulate DeFi transactions on HyperEVM.",
========
  title: "HYPE",
  description: "Universal DeFi Intelligence & Simulation Platform",
>>>>>>>> 4774fe7fcbaee6e8f8178b226f19fdaa6bd8de92:src/app/layout.tsx
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
