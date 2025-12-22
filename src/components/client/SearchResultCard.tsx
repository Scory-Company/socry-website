"use client"

import { UnifiedSearchResult } from "@/types/search"
import { Star, FileText, ExternalLink, FileDown, Book, Sparkles, CheckCircle2, Globe } from "lucide-react"
import { motion } from "framer-motion"

interface SearchResultCardProps {
  result: UnifiedSearchResult
  highlightText?: string
  onPress?: () => void
  onSimplify?: () => void
  onReadSimplified?: (articleId: string) => void
}

// Helper: Convert citations to rating (0-5 scale)
function citationsToRating(citations: number): number {
  if (citations >= 1000) return 5.0
  if (citations >= 500) return 4.5
  if (citations >= 200) return 4.0
  if (citations >= 100) return 3.5
  if (citations >= 50) return 3.0
  if (citations >= 20) return 2.5
  if (citations >= 10) return 2.0
  if (citations >= 5) return 1.5
  if (citations >= 1) return 1.0
  return 0.5
}

export default function SearchResultCard({
  result,
  highlightText,
  onPress,
  onSimplify,
  onReadSimplified,
}: SearchResultCardProps) {
  const isExternalSource = result.source === "openalex" || result.source === "scholar"
  const isSimplified = result.metadata?.isSimplified || false
  const rating = result.rating || (result.citations ? citationsToRating(result.citations) : 0)
  const authorText = Array.isArray(result.authors) ? result.authors.join(", ") : result.authors || "Unknown Author"

  // Highlight matching text in title
  const renderHighlightedTitle = () => {
    if (!highlightText || highlightText.trim() === "") {
      return <span className="text-foreground">{result.title}</span>
    }

    const parts = result.title.split(new RegExp(`(${highlightText})`, "gi"))
    return (
      <span className="text-foreground">
        {parts.map((part, i) =>
          part.toLowerCase() === highlightText.toLowerCase() ? (
            <span key={i} className="bg-primary/20 font-bold rounded px-0.5">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    )
  }

  const handleOpenUrl = (url?: string | null) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const handleOpenDoi = () => {
    if (result.doi) {
      const doiUrl = result.doi.startsWith("http") ? result.doi : `https://doi.org/${result.doi}`
      window.open(doiUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleMainAction = () => {
    if (isSimplified && result.metadata?.articleId && onReadSimplified) {
      onReadSimplified(result.metadata.articleId)
    } else if (!isSimplified && onSimplify) {
      onSimplify()
    } else if (onPress) {
      onPress()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border-2 border-border rounded-xl p-4 sm:p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
    >
      {/* Badges Container */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Source Badge */}
        {isExternalSource && (
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
            <Globe className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary">
              {result.source === "scholar" ? "Google Scholar" : "OpenAlex"}
            </span>
          </div>
        )}

        {/* Already Simplified Badge */}
        {isSimplified && (
          <div className="flex items-center gap-1 bg-success/10 px-2 py-1 rounded-md">
            <CheckCircle2 className="w-3 h-3 text-success" />
            <span className="text-[10px] font-semibold text-success">Already Simplified</span>
          </div>
        )}
      </div>

      {/* Title with highlight */}
      <h3 className="text-base sm:text-lg font-semibold mb-2 leading-tight line-clamp-2">{renderHighlightedTitle()}</h3>

      {/* Authors */}
      <p className="text-sm text-muted-foreground italic mb-2 line-clamp-1">{authorText}</p>

      {/* Metadata Row: Category/Journal + Year */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {(result.category || result.journal) && (
          <div className="bg-primary/10 px-2 py-1 rounded-md max-w-[70%]">
            <span className="text-xs font-semibold text-primary-darker line-clamp-1">
              {result.category || result.journal}
            </span>
          </div>
        )}

        {result.year && <span className="text-xs font-semibold text-muted-foreground">{result.year}</span>}
      </div>

      {/* Excerpt/Abstract */}
      {result.excerpt && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{result.excerpt}</p>}

      {/* Footer: Rating, Citations, Reads */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Citations */}
        {result.citations !== undefined && result.citations > 0 && (
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{result.citations} citations</span>
          </div>
        )}

        {/* Reads */}
        {result.reads && <span className="text-xs text-muted-foreground">{result.reads}</span>}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* PDF Button */}
        {result.pdfUrl && (
          <button
            onClick={() => handleOpenUrl(result.pdfUrl)}
            className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FileDown className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">PDF</span>
          </button>
        )}

        {/* DOI Button */}
        {result.doi && (
          <button
            onClick={handleOpenDoi}
            className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">DOI</span>
          </button>
        )}

        {/* Main Action Button */}
        {isSimplified ? (
          <button
            onClick={handleMainAction}
            className="flex items-center gap-1 bg-primary hover:bg-primary-dark-shade px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          >
            <Book className="w-4 h-4 text-primary-foreground" />
            <span className="text-xs font-semibold text-primary-foreground">Read</span>
          </button>
        ) : (
          <button
            onClick={handleMainAction}
            className="flex items-center gap-1 bg-primary hover:bg-primary-dark-shade px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-xs font-semibold text-primary-foreground">
              {isExternalSource ? "Simplify" : "Read"}
            </span>
          </button>
        )}
      </div>
    </motion.div>
  )
}
