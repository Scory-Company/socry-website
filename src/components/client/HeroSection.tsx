"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, StarHalf, Sparkles, BookOpen, Zap, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/providers/ThemeProvider"
import { motion } from "framer-motion"
import LoginDialog from "@/components/client/LoginDialog"
import { toast } from "sonner"

export default function HeroSection() {
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      toast.error("Please enter a search query", {
        description: "Search field cannot be empty",
      })
      return
    }

    if (!isAuthenticated) {
      setIsLoginDialogOpen(true)
      return
    }

    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true)
    
    // If user has a search query and is already personalized, redirect to search with query
    if (searchQuery.trim()) {
      // Check if user has completed personalization
      const { personalizationApi } = await import('@/services')
      const hasPersonalization = await personalizationApi.hasCompletedPersonalization()
      
      if (hasPersonalization) {
        // Already personalized → go to search with query
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
      // If not personalized, LoginDialog will handle redirect to /personalization
    }
  }

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query)

    if (!isAuthenticated) {
      setIsLoginDialogOpen(true)
      return
    }

    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />

      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-bl from-primary/8 via-primary/3 to-transparent pointer-events-none blur-3xl" />



      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{
              staggerChildren: 0.12,
              delayChildren: 0.15,
            }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/20 rounded-full text-xs sm:text-sm font-medium"
              variants={itemVariants}
              transition={{ duration: 0.7 }}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span>Powered by RAG</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              variants={itemVariants}
              transition={{ duration: 0.7 }}
            >
              Make{" "}
              <span className="relative inline-block">
                research
                <motion.svg
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.path
                    d="M2 8C50 4 100 2 150 4C200 6 250 8 298 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary"
                  />
                </motion.svg>
              </span>{" "}
              easy
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl"
              variants={itemVariants}
              transition={{ duration: 0.7 }}
            >
              Scory uses RAG technology to transform complex scientific articles into accurate, easy-to-understand
              summaries personalized to your reading level. Get reliable insights without AI hallucination.
            </motion.p>

            {/* Search Bar - More Prominent */}
            <motion.div className="relative max-w-2xl" variants={itemVariants} transition={{ duration: 0.7 }}>
              <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 bg-card border-2 border-primary/30 rounded-2xl shadow-lg hover:border-primary/50 transition-all focus-within:border-primary focus-within:shadow-xl">
                <div className="hidden sm:flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl shrink-0">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for scientific articles..."
                  className="flex-1 px-3 py-2.5 sm:px-2 sm:py-3 bg-transparent text-sm sm:text-base focus:outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-primary hover:bg-primary-dark-shade text-primary-foreground font-semibold rounded-xl transition-all hover:scale-105 whitespace-nowrap text-sm sm:text-base"
                >
                  Search
                </button>
              </form>

              {/* Popular searches hint */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="font-medium">Popular:</span>
                <button
                  type="button"
                  onClick={() => handlePopularSearch("Machine Learning")}
                  className="px-2.5 py-1 sm:px-3 sm:py-1 bg-muted/50 hover:bg-muted rounded-full transition-colors"
                >
                  Machine Learning
                </button>
                <button
                  type="button"
                  onClick={() => handlePopularSearch("Climate Change")}
                  className="px-2.5 py-1 sm:px-3 sm:py-1 bg-muted/50 hover:bg-muted rounded-full transition-colors"
                >
                  Climate Change
                </button>
                <button
                  type="button"
                  onClick={() => handlePopularSearch("Biotechnology")}
                  className="px-2.5 py-1 sm:px-3 sm:py-1 bg-muted/50 hover:bg-muted rounded-full transition-colors"
                >
                  Biotechnology
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 pt-4" variants={itemVariants}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">10K+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Articles Simplified</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl shrink-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">5 Min</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Average Read Time</div>
                </div>
              </div>
            </motion.div>

            {/* Rating */}
            <motion.div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4" variants={itemVariants}>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-foreground text-foreground" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-foreground text-foreground" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-foreground text-foreground" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-foreground text-foreground" />
                <StarHalf className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-foreground text-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">4.8</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Trusted by researchers</span>
            </motion.div>
          </motion.div>

          {/* Right Content - Article Preview Mockup */}
          <motion.div
            className="relative lg:pl-12 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="relative h-96 md:h-120 lg:h-150">
                {/* Article Card - Top Left */}
                <motion.div
                  className="absolute top-0 left-0 w-48 md:w-56 lg:w-64 bg-card border border-border rounded-xl md:rounded-2xl shadow-lg p-3 md:p-4 lg:p-5 transform -rotate-6 hover:rotate-0 transition-transform duration-300 z-10"
                  animate="animate"
                >
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-primary" />
                      </div>
                      <span className="text-[10px] md:text-xs font-semibold text-muted-foreground">Research Paper</span>
                    </div>
                    <h3 className="text-xs md:text-sm font-bold line-clamp-2">AI for Athlete Performance</h3>
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                      <span>Sports Analytics Journal</span>
                      <span>•</span>
                      <span>2025</span>
                    </div>
                    <div className="pt-1 md:pt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-[10px] md:text-xs font-medium text-primary">75%</span>
                    </div>
                  </div>
                </motion.div>

                {/* Main Phone Mockup - Center */}
                <motion.div
                  className="absolute top-8 md:top-12 right-0 w-56 md:w-64 lg:w-72 h-96 md:h-110 lg:h-120 bg-card border-2 border-border rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden z-20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 md:w-36 lg:w-40 h-5 md:h-6 lg:h-7 bg-background rounded-b-2xl md:rounded-b-3xl"></div>

                  {/* Phone content */}
                  <div className="p-4 md:p-5 lg:p-6 pt-9 md:pt-11 lg:pt-12 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 md:mb-5 lg:mb-6">
                      <h3 className="text-xs md:text-sm font-bold">Article Summary</h3>
                      <div className="px-1.5 md:px-2 py-0.5 md:py-1 bg-primary/10 rounded-md text-[10px] md:text-xs font-semibold text-primary-darker">
                        RAG Powered
                      </div>
                    </div>

                    {/* Article Preview */}
                    <div className="space-y-3 md:space-y-4 flex-1">
                      {/* Title simulation */}
                      <div className="space-y-1.5 md:space-y-2">
                        <div className="h-2 md:h-2.5 lg:h-3 bg-foreground/80 rounded-full w-full"></div>
                        <div className="h-2 md:h-2.5 lg:h-3 bg-foreground/60 rounded-full w-4/5"></div>
                      </div>

                      {/* Content blocks */}
                      <div className="space-y-2 md:space-y-3 pt-1 md:pt-2">
                        <div className="space-y-1 md:space-y-1.5">
                          <div className="h-1.5 md:h-2 bg-muted rounded-full w-full"></div>
                          <div className="h-1.5 md:h-2 bg-muted rounded-full w-full"></div>
                          <div className="h-1.5 md:h-2 bg-muted rounded-full w-3/4"></div>
                        </div>
                        <div className="space-y-1 md:space-y-1.5">
                          <div className="h-1.5 md:h-2 bg-muted rounded-full w-full"></div>
                          <div className="h-1.5 md:h-2 bg-muted rounded-full w-5/6"></div>
                        </div>
                      </div>

                      {/* Key Points */}
                      <div className="space-y-1.5 md:space-y-2 pt-2 md:pt-3">
                        <div className="text-[10px] md:text-xs font-semibold text-muted-foreground">Key Points</div>
                        <div className="flex items-start gap-1.5 md:gap-2">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-primary rounded-full mt-1 md:mt-1.5"></div>
                          <div className="h-1.5 md:h-2 bg-muted rounded-full flex-1"></div>
                        </div>
                        <div className="flex items-start gap-1.5 md:gap-2">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-primary rounded-full mt-1 md:mt-1.5"></div>
                          <div className="h-1.5 md:h-2 bg-muted rounded-full flex-1"></div>
                        </div>
                        <div className="flex items-start gap-1.5 md:gap-2">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-primary rounded-full mt-1 md:mt-1.5"></div>
                          <div className="h-1.5 md:h-2 bg-muted rounded-full w-4/5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom indicators */}
                    <div className="pt-3 md:pt-4 flex gap-1.5 md:gap-2 justify-center">
                      <div className="w-6 md:w-7 lg:w-8 h-0.5 md:h-1 bg-primary rounded-full"></div>
                      <div className="w-6 md:w-7 lg:w-8 h-0.5 md:h-1 bg-muted rounded-full"></div>
                      <div className="w-6 md:w-7 lg:w-8 h-0.5 md:h-1 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Reading Stats Card - Bottom Right */}
                <motion.div
                  className="absolute bottom-0 right-8 md:right-10 lg:right-12 w-44 md:w-48 lg:w-56 bg-card border border-border rounded-xl md:rounded-2xl shadow-lg p-3 md:p-3.5 lg:p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300 z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    className="space-y-2 md:space-y-3"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      repeatType: "mirror",
                    }}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-primary" />
                      <span className="text-[10px] md:text-xs font-semibold">Reading Progress</span>
                    </div>
                    <div className="text-2xl md:text-2xl lg:text-3xl font-bold text-primary-darker">5 min</div>
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="flex justify-between text-[10px] md:text-xs">
                        <span className="text-primary-darker">Complexity</span>
                        <span className="font-medium text-primary-darker">Simplified</span>
                      </div>
                      <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[90%] bg-primary-darker rounded-full"></div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute top-1/3 -left-8 w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-linear-to-br from-primary/20 to-primary/5 rounded-full blur-3xl -z-10"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    repeatType: "mirror",
                  }}
                />
                <motion.div
                  className="absolute bottom-1/3 -right-12 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-linear-to-tl from-primary/15 to-primary/5 rounded-full blur-3xl -z-10"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    repeatType: "mirror",
                    delay: 1,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onLoginSuccess={handleLoginSuccess}
        searchQuery={searchQuery}
      />
    </section>
  )
}
