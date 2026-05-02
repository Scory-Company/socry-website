import CTASection from "@/components/client/CTASection"
import FAQ from "@/components/client/FAQ"
import FeaturesSection from "@/components/client/FeaturesSection"
import HeroSection from "@/components/client/HeroSection"
import PricingSection from "@/components/client/PricingSection"
import PublicNavbar from "@/components/client/PublicNavbar"
import SocialProof from "@/components/client/SocialProof"
import UnderDevelopmentAnnouncement from "@/components/client/UnderDevelopmentAnnouncement"

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950">
      <UnderDevelopmentAnnouncement />
      <PublicNavbar />

      <main className="relative pt-20">
        <div id="hero">
          <HeroSection />
        </div>
        <FeaturesSection />
        <PricingSection />
        <div id="social-proof">
          <SocialProof />
        </div>
        <FAQ />
        <CTASection />
      </main>
    </div>
  )
}
