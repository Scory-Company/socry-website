"use client";

import PublicNavbar from "@/components/client/PublicNavbar";
import HeroSection from "@/components/client/HeroSection";
import HowItWorks from "@/components/client/HowItWorks";
import SocialProof from "@/components/client/SocialProof";
import TrendingArticles from "@/components/client/TrendingArticles";
import Footer from "@/components/client/Footer";
import StrategicPartners from "@/components/client/StrategicPartners";
import FAQ from "@/components/client/FAQ";

export default function Home() {
  const navItems = [
    { name: "Home", link: "#hero" },
    { name: "Articles", link: "#trending" },
    { name: "How It Works", link: "#how-it-works" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950">
      <PublicNavbar navItems={navItems} showAuthButtons={true} />

      {/* Main Content */}
      <main className="relative pt-20"> {/* Add padding for fixed navbar */}
        <div id="hero">
          <HeroSection />
        </div>
        
        <div id="trending" className="scroll-mt-24">
           {/* scroll-mt-24 adds margin top when scrolling to this id so it's not hidden by navbar */}
          <TrendingArticles timeframe="7d" limit={6} />
        </div>

        <div id="how-it-works" className="scroll-mt-24">
           <HowItWorks/>
        </div>

        <div id="social-proof">
           <SocialProof/>
        </div>

        <StrategicPartners />
        
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
