"use client";

import PublicNavbar from "@/components/client/PublicNavbar";
import HeroSection from "@/components/client/HeroSection";
import FeaturesSection from "@/components/client/FeaturesSection";
import PricingSection from "@/components/client/PricingSection";
import CTASection from "@/components/client/CTASection";
import HowItWorks from "@/components/client/HowItWorks";
import SocialProof from "@/components/client/SocialProof";
import TrendingArticles from "@/components/client/TrendingArticles";
import StrategicPartners from "@/components/client/StrategicPartners";
import FAQ from "@/components/client/FAQ";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950">
      <PublicNavbar showAuthButtons={true} />

      {/* Main Content */}
      <main className="relative pt-20"> {/* Add padding for fixed navbar */}
        <div id="hero">
          <HeroSection />
        </div>
        
        <FeaturesSection />

        <PricingSection />


        <div id="social-proof">
           <SocialProof/>
        </div>
        <FAQ />
        <CTASection />

      </main>
    </div>
  );
}
