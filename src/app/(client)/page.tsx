import HeroSection from "@/components/client/HeroSection";
import HowItWorks from "@/components/client/HowItWorks";
import SocialProof from "@/components/client/SocialProof";
import TrendingArticles from "@/components/client/TrendingArticles";
import { getMostPopularArticles } from "@/data/mock/articles";

export default function Home() {
  const trendingArticles = getMostPopularArticles();

  return (
    <>
      <HeroSection />
      <TrendingArticles articles={trendingArticles} />
      <HowItWorks/>
      <SocialProof/>
    </>
  );
}
