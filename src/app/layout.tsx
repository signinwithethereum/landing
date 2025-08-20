import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import { Production } from "./production";

import "./globals.css";
import "ethereum-identity-kit/css";
import "@rainbow-me/rainbowkit/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Sign in with Ethereum",
  description:
    "Sign in with Ethereum is an open standard for authentication with Ethereum accounts. Works with crypto and non-crypto apps. Easily integrate with libraries.",
  keywords: [
    "Ethereum",
    "authentication",
    "SIWE",
    "Sign in with Ethereum",
    "crypto",
    "web3",
    "wallet",
  ],
  authors: [{ name: "Ethereum Identity Foundation" }],
  openGraph: {
    title: "Sign in with Ethereum",
    description: "Sign in with Ethereum is an open standard for authentication with Ethereum accounts. Works with crypto and non-crypto apps. Easily integrate with libraries.",
    images: [
      {
        url: "https://siwe.xyz/assets/og.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign in with Ethereum",
    description: "Sign in with Ethereum is an open standard for authentication with Ethereum accounts. Works with crypto and non-crypto apps. Easily integrate with libraries.",
    images: ["https://siwe.xyz/assets/og.png"],
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
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <Providers>{children}</Providers>
        <Production>
          <Analytics />
        </Production>
      </body>
    </html>
  );
}
