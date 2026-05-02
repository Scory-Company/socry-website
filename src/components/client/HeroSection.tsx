"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, FileText, Brain, BookOpen, Star, StarHalf } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const goToEarlyAccess = (query: string) => {
    const trimmedQuery = query.trim()
    const params = new URLSearchParams()
    if (trimmedQuery) {
      params.set("intent", trimmedQuery)
    }

    const target = params.size ? `/early-access?${params.toString()}` : "/early-access"
    router.push(target)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query", { description: "Search field cannot be empty" })
      return
    }

    goToEarlyAccess(searchQuery)
  }

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query)
    goToEarlyAccess(query)
  }

  return (
    <section className="relative bg-background overflow-hidden min-h-[88vh] flex flex-col items-center justify-center">

      {/* ── Floating decorative elements ── */}

      {/* Top-left — article card */}
      <motion.div
        className="absolute top-24 left-8 lg:left-24 w-44 bg-card border border-border rounded-2xl shadow-md p-3.5 hidden md:block"
        initial={{ opacity: 0, y: -20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">Research Paper</span>
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-foreground/60 rounded-full w-full" />
            <div className="h-2 bg-foreground/30 rounded-full w-4/5" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <div className="h-1.5 bg-muted rounded-full flex-1" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <div className="h-1.5 bg-muted rounded-full w-4/5" />
          </div>
        </motion.div>
      </motion.div>

      {/* Top-right — AI badge */}
      <motion.div
        className="absolute top-20 right-8 lg:right-24 w-40 bg-card border border-border rounded-2xl shadow-md p-3.5 hidden md:block"
        initial={{ opacity: 0, y: -20, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-[10px] font-semibold">AI Summary</span>
          </div>
          <div className="text-[10px] text-muted-foreground leading-relaxed">
            Personalized to your reading level
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-primary rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom-left — reading time */}
      <motion.div
        className="absolute bottom-32 left-8 lg:left-20 w-36 bg-card border border-border rounded-2xl shadow-md p-3.5 hidden lg:block"
        initial={{ opacity: 0, x: -20, rotate: 4 }}
        animate={{ opacity: 1, x: 0, rotate: 4 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: 1 }}
          className="space-y-1.5"
        >
          <div className="text-[10px] text-muted-foreground font-medium">Avg. Read Time</div>
          <div className="text-2xl font-bold text-primary">5 min</div>
          <div className="text-[10px] text-muted-foreground">vs. 45 min original</div>
        </motion.div>
      </motion.div>

      {/* Bottom-right — articles count */}
      <motion.div
        className="absolute bottom-28 right-8 lg:right-20 w-36 bg-card border border-border rounded-2xl shadow-md p-3.5 hidden lg:block"
        initial={{ opacity: 0, x: 20, rotate: -4 }}
        animate={{ opacity: 1, x: 0, rotate: -4 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: 1.5 }}
          className="space-y-1.5"
        >
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground font-medium">Articles</span>
          </div>
          <div className="text-2xl font-bold">10K+</div>
          <div className="text-[10px] text-muted-foreground">Simplified & indexed</div>
        </motion.div>
      </motion.div>

      {/* ── Center content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-3xl mx-auto py-20 space-y-7">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-card border border-border rounded-full text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            RAG-Powered AI
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Make Research{" "}
          <span className="text-primary">Easy.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Tell us what you&apos;re researching. We&apos;ll find the papers, map the science, and simplify it — tailored to your reading level.
        </motion.p>

        {/* Search bar */}
        <motion.div
          className="w-full max-w-xl space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 p-2 bg-card border border-border rounded-full shadow-sm hover:border-primary/40 focus-within:border-primary focus-within:shadow-md transition-all"
          >
            <div className="flex items-center justify-center w-9 h-9 bg-muted rounded-full shrink-0 ml-1">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you researching?"
              className="min-w-0 flex-1 py-2 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-full transition-all"
            >
              <span className="hidden sm:inline">Join Early Access</span>
              <span className="sm:hidden">Join</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Try:</span>
            {["Quantum Computing", "Climate Change", "Gut Microbiome", "Deep Learning"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handlePopularSearch(tag)}
                className="px-3 py-1 bg-muted/60 hover:bg-muted rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="flex items-center gap-3 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <div className="flex items-center gap-0.5">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
            <StarHalf className="w-4 h-4 fill-primary text-primary" />
          </div>
          <span className="text-sm font-semibold">4.8</span>
          <span className="text-sm text-muted-foreground">— trusted by researchers worldwide</span>
        </motion.div>
      </div>

    </section>
  )
}

