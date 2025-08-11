"use client";

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
    <div className="min-h-screen bg-background overflow-hidden relative">
      <Header />
      <div className="absolute z-0 -top-[50rem] left-0 w-full h-full min-h-screen">
        <div
          className={cn(
            "absolute z-0 top-0 left-0 w-full h-full min-h-screen",
            "[background-size:100px_100px]",
            "[background-image:linear-gradient(to_right,#00BECC33_1px,transparent_1px),linear-gradient(to_bottom,#00BECC33_1px,transparent_1px)]",
          )}
        />
        <div className="z-10 absolute top-0 left-0 w-full h-full min-h-screen [background-image:radial-gradient(transparent,#222222cc,#222222)]" />
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
