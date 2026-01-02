"use client"

import { motion } from "framer-motion"
import { Sparkles, ChevronRight, Star, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ForYouSection() {
  const router = useRouter()

  // Mock personalized recommendations
  const forYouArticles = [
    {
      id: "1",
      title: "Deep Learning Architectures for Natural Language Processing",
      excerpt: "Exploring transformer models and their applications in modern NLP tasks...",
      category: "Machine Learning",
      authors: ["Dr. Sarah Chen", "Prof. Michael Zhang"],
      rating: 4.8,
      reads: "2.3k reads",
      slug: "deep-learning-nlp",
      isNew: true,
    },
    {
      id: "2",
      title: "Sustainable Energy Solutions for Urban Development",
      excerpt: "Innovative approaches to renewable energy integration in smart cities...",
      category: "Environmental Science",
      authors: ["Dr. Emma Wilson"],
      rating: 4.6,
      reads: "1.8k reads",
      slug: "sustainable-energy-urban",
      isNew: false,
    },
    {
      id: "3",
      title: "CRISPR Gene Editing: Recent Advances and Ethical Considerations",
      excerpt: "A comprehensive review of CRISPR-Cas9 technology and its implications...",
      category: "Biotechnology",
      authors: ["Prof. James Anderson", "Dr. Lisa Park"],
      rating: 4.9,
      reads: "3.1k reads",
      slug: "crispr-gene-editing",
      isNew: true,
    },
    {
      id: "4",
      title: "Blockchain Technology in Healthcare Data Management",
      excerpt: "Examining the potential of distributed ledger technology for medical records...",
      category: "Technology",
      authors: ["Dr. Robert Kim"],
      rating: 4.5,
      reads: "1.5k reads",
      slug: "blockchain-healthcare",
      isNew: false,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">For You</h3>
          <span className="text-xs text-muted-foreground">Personalized recommendations</span>
        </div>
        <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          See More
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forYouArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(`/article/${article.slug}`)}
            className="group cursor-pointer bg-card border-2 border-border hover:border-primary/50 rounded-xl p-5 transition-all hover:shadow-md"
          >
            {/* Header: Category + New Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary/10 px-2 py-1 rounded-md">
                <span className="text-xs font-semibold text-primary">{article.category}</span>
              </div>
              {article.isNew && (
                <div className="bg-green-500/10 px-2 py-1 rounded-md">
                  <span className="text-xs font-semibold text-green-600">New</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h4 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h4>

            {/* Authors */}
            <p className="text-sm text-muted-foreground italic mb-2 line-clamp-1">
              {article.authors.join(", ")}
            </p>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {article.excerpt}
            </p>

            {/* Footer: Rating + Reads */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">{article.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{article.reads}</span>
              </div>
              <button className="flex items-center gap-1 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <BookOpen className="w-4 h-4" />
                Read
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
