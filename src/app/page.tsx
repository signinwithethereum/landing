'use client'

import Header from "./components/Header";
import Hero from "./components/Hero";
import KeyFeatures from "./components/KeyFeatures";
import HowItWorks from "./components/HowItWorks";
import AddToApp from "./components/AddToApp";
import EthereumIdentityStack from "./components/EthereumIdentityStack";
import FeaturedIntegrations from "./components/FeaturedIntegrations";
import Footer from "./components/Footer";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="absolute z-0 -top-96 inset-0 h-full w-full">
        <div
          className={cn(
            "absolute z-0 inset-0 h-[300%] w-full",
            "[background-size:100px_100px]",
            "[background-image:linear-gradient(to_right,#00BECC44_1px,transparent_1px),linear-gradient(to_bottom,#00BECC44_1px,transparent_1px)]",
          )}
        />
        <div className="z-10 absolute h-[300%] w-full [background-image:radial-gradient(transparent,#222222bb,#222222)]" />
      </div>
      <main className="relative z-20">
        <Hero />
        <KeyFeatures />
        <HowItWorks />
        <AddToApp />
        <EthereumIdentityStack />
        <FeaturedIntegrations />
      </main>
      <Footer />
    </div>
  );
}