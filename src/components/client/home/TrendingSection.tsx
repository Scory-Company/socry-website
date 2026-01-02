"use client"

import { motion } from "framer-motion"
import { TrendingUp, ChevronRight, Star, Flame } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TrendingSection() {
  const router = useRouter()

  // Mock trending articles
  const trendingArticles = [
    {
      id: "1",
      rank: 1,
      title: "Artificial Intelligence in Drug Discovery: Accelerating Pharmaceutical Research",
      category: "Biotechnology",
      authors: ["Dr. Maria Garcia", "Prof. John Smith"],
      rating: 4.9,
      reads: "5.2k reads",
      trendingScore: "+245%",
      slug: "ai-drug-discovery",
    },
    {
      id: "2",
      rank: 2,
      title: "Neuroplasticity and Learning: How the Brain Adapts to New Information",
      category: "Neuroscience",
      authors: ["Dr. Emily Brown"],
      rating: 4.8,
      reads: "4.8k reads",
      trendingScore: "+198%",
      slug: "neuroplasticity-learning",
    },
    {
      id: "3",
      rank: 3,
      title: "Quantum Entanglement: Implications for Future Communication Technologies",
      category: "Physics",
      authors: ["Prof. David Lee", "Dr. Anna Chen"],
      rating: 4.7,
      reads: "4.1k reads",
      trendingScore: "+167%",
      slug: "quantum-entanglement",
    },
    {
      id: "4",
      rank: 4,
      title: "Microbiome Research: The Hidden Ecosystem Within Us",
      category: "Biology",
      authors: ["Dr. Sarah Johnson"],
      rating: 4.6,
      reads: "3.9k reads",
      trendingScore: "+142%",
      slug: "microbiome-research",
    },
    {
      id: "5",
      rank: 5,
      title: "Carbon Capture Technologies: A Path to Net-Zero Emissions",
      category: "Environmental Science",
      authors: ["Prof. Michael Green", "Dr. Lisa Wang"],
      rating: 4.8,
      reads: "3.5k reads",
      trendingScore: "+128%",
      slug: "carbon-capture-tech",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-foreground">Trending This Week</h3>
        </div>
        <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
        {trendingArticles.slice(0, 3).map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => router.push(`/article/${article.slug}`)}
            className={`group cursor-pointer p-4 hover:bg-muted/50 transition-all ${
              index !== trendingArticles.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Rank Badge */}
              <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg ${
                article.rank === 1 
                  ? "bg-yellow-500/20 text-yellow-600" 
                  : article.rank === 2 
                  ? "bg-gray-400/20 text-gray-600" 
                  : article.rank === 3 
                  ? "bg-orange-500/20 text-orange-600" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {article.rank}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Category + Trending Score */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 px-2 py-0.5 rounded-md">
                    <span className="text-xs font-semibold text-primary">{article.category}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">{article.trendingScore}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>

                {/* Authors */}
                <p className="text-sm text-muted-foreground italic mb-2 line-clamp-1">
                  {article.authors.join(", ")}
                </p>

                {/* Footer: Rating + Reads */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">{article.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{article.reads}</span>
                </div>
              </div>

              {/* Arrow Icon */}
              <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
