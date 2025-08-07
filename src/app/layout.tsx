import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";

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
    "Sign in with Ethereum - Open standard for authentication with Ethereum accounts",
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
  authors: [{ name: "Ethereum Follow Protocol" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0a0a0a",
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
      </body>
    </html>
  );
}
