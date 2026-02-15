// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from "../components/BootstrapClient";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import CursorFX from "@/components/CursorFX";
import MagneticButtons from "@/components/MagneticButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eliachar Feig | Senior Software Engineer",
  description:
    "Senior Mobile Engineer specializing in iOS, Flutter and Applied AI. Building scalable, product-driven systems.",
  // icons: {
  //   icon: "/icon.png",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-bg-c1="off">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        <div className="cursor-dot" />
        <div className="cursor-outline" />

        <div className="bg-orb orb-1" aria-hidden="true" />
        <div className="bg-orb orb-2" aria-hidden="true" />

        <div id="bg-c1-layer" aria-hidden="true" />

        <CursorFX />
        <BootstrapClient />
        <MagneticButtons />

        {children}

      </body>
    </html>
  );
}

