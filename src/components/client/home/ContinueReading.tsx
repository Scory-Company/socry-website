"use client"

import { motion } from "framer-motion"
import { Clock, ChevronRight, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function ContinueReading() {
  const router = useRouter()

  // Mock data for articles in progress
  const continueReadingArticles = [
    {
      id: "1",
      title: "Machine Learning Applications in Healthcare: A Comprehensive Review",
      category: "Machine Learning",
      progress: 65,
      timeLeft: "8 min left",
      slug: "ml-healthcare-review",
    },
    {
      id: "2",
      title: "Quantum Computing: Breaking the Barriers of Classical Computation",
      category: "Physics",
      progress: 30,
      timeLeft: "15 min left",
      slug: "quantum-computing-barriers",
    },
    {
      id: "3",
      title: "Climate Change Impact on Marine Biodiversity",
      category: "Environmental Science",
      progress: 85,
      timeLeft: "3 min left",
      slug: "climate-marine-biodiversity",
    },
  ]

  if (continueReadingArticles.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Continue Reading</h3>
        </div>
        <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {continueReadingArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(`/article/${article.slug}`)}
            className="group cursor-pointer bg-card border-2 border-border hover:border-primary/50 rounded-xl p-4 transition-all hover:shadow-md"
          >
            {/* Category Badge */}
            <div className="inline-block bg-primary/10 px-2 py-1 rounded-md mb-3">
              <span className="text-xs font-semibold text-primary">{article.category}</span>
            </div>

            {/* Title */}
            <h4 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h4>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{article.progress}% complete</span>
                <span>{article.timeLeft}</span>
              </div>
              <Progress value={article.progress} className="h-2" />
            </div>

            {/* Continue Button */}
            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary px-4 py-2 rounded-lg font-medium text-sm transition-all group-hover:scale-105">
              <BookOpen className="w-4 h-4" />
              Continue Reading
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
