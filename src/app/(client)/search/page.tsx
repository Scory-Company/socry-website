"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, CheckCircle, Bell } from "lucide-react"
import SearchResultCard from "@/components/client/SearchResultCard"
import FilterChip from "@/components/client/FilterChip"
import SearchSidebar from "@/components/client/SearchSidebar"
import ProfileDropdown from "@/components/client/ProfileDropdown"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { UnifiedSearchResult } from "@/types/search"
import { toast } from "sonner"

// Mock data untuk demo
const MOCK_RESULTS: UnifiedSearchResult[] = [
  {
    id: "1",
    title: "Machine Learning Approaches for Predicting Athlete Performance in Competitive Sports",
    excerpt:
      "This comprehensive study explores various machine learning algorithms and their application in predicting athlete performance metrics across different competitive sports disciplines.",
    authors: ["John Smith", "Sarah Johnson", "Michael Chen"],
    year: 2024,
    source: "internal",
    category: "Sports Science",
    rating: 4.8,
    reads: "1.2K reads",
    metadata: {
      isSimplified: true,
      articleId: "art-001",
    },
  },
  {
    id: "2",
    title: "Deep Learning Models for Sports Analytics: A Comprehensive Review",
    excerpt:
      "An extensive review of deep learning methodologies applied to sports data analysis, including performance prediction and injury prevention.",
    authors: ["Emily Davis", "Robert Brown"],
    year: 2023,
    source: "openalex",
    journal: "Journal of Sports Analytics",
    citations: 156,
    pdfUrl: "https://example.com/paper.pdf",
    doi: "10.1234/jsa.2023.001",
    metadata: {
      isExternal: true,
      externalSource: "openalex",
    },
  },
  {
    id: "3",
    title: "Climate Change Impact on Global Agricultural Productivity: A Meta-Analysis",
    excerpt:
      "This meta-analysis examines the correlation between climate change indicators and agricultural output across different geographical regions.",
    authors: ["Maria Garcia", "James Wilson", "Li Wei"],
    year: 2024,
    source: "scholar",
    journal: "Environmental Science Reviews",
    citations: 342,
    doi: "10.5678/esr.2024.042",
    metadata: {
      isExternal: true,
      externalSource: "scholar",
    },
  },
  {
    id: "4",
    title: "Biotechnology Innovations in Crop Resistance: Recent Advances and Future Prospects",
    excerpt:
      "Exploring cutting-edge biotechnology techniques for developing climate-resilient crops with enhanced resistance to pests and diseases.",
    authors: ["David Kumar", "Anna Schmidt"],
    year: 2025,
    source: "internal",
    category: "Biotechnology",
    rating: 4.5,
    reads: "856 reads",
    pdfUrl: "https://example.com/biotech.pdf",
  },
]

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<UnifiedSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSource, setSelectedSource] = useState<"all" | "internal" | "external">("all")

  useEffect(() => {
    // Simulate API call
    const fetchResults = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Filter mock results based on query
      const filtered = MOCK_RESULTS.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.excerpt.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsLoading(false)
    }

    fetchResults()
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`)
    }
  }

  const handleSimplify = (result: UnifiedSearchResult) => {
    toast.success("Simplification started!", {
      description: `Processing: "${result.title}"`,
    })
  }

  const handleReadSimplified = (articleId: string) => {
    toast.info("Opening article...", {
      description: `Article ID: ${articleId}`,
    })
  }

  const handleClearSearch = () => {
    setSearchInput("")
    router.push("/search?q=")
  }

  const handleClearCategory = () => {
    setSelectedCategory("All")
  }

  const handleClearAllFilters = () => {
    setSelectedCategory("All")
    setSelectedSource("all")
  }

  // Apply filters
  const filteredResults = results.filter((result) => {
    // Source filter
    const matchesSource =
      selectedSource === "all" ||
      (selectedSource === "internal" && result.source === "internal") ||
      (selectedSource === "external" && (result.source === "openalex" || result.source === "scholar"))

    // Category filter
    const matchesCategory = selectedCategory === "All" || result.category === selectedCategory || result.journal?.includes(selectedCategory)

    return matchesSource && matchesCategory
  })

  return (
    <SidebarProvider defaultOpen={true}>
      <SearchSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          {/* Header with Search Bar and Profile */}
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
              {/* Left: Sidebar Trigger + Search */}
              <div className="flex items-center gap-3 flex-1">
                <SidebarTrigger />
                <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-card border-2 border-border rounded-xl focus-within:border-primary transition-all">
                    <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search for scientific articles..."
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </form>
              </div>

              {/* Right: Notifications + Profile */}
              <div className="flex items-center gap-3">
                <button className="relative flex items-center justify-center w-10 h-10 bg-card border-2 border-border hover:border-primary/50 rounded-xl transition-all hover:scale-105">
                  <Bell className="w-5 h-5 text-foreground" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    3
                  </span>
                </button>
                <ProfileDropdown />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"} found
                {query && <span className="text-muted-foreground"> for "{query}"</span>}
              </h2>

              {/* Active Filters */}
              {(query || selectedCategory !== "All") && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {query && <FilterChip label={`"${query.length > 20 ? query.substring(0, 20) + "..." : query}"`} onRemove={handleClearSearch} />}
                  {selectedCategory !== "All" && <FilterChip label={selectedCategory} onRemove={handleClearCategory} />}
                </div>
              )}

              {/* Clear All Button */}
              {(query || selectedCategory !== "All") && (
                <button onClick={handleClearAllFilters} className="text-sm font-medium text-destructive hover:underline">
                  Clear all filters
                </button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border-2 border-border rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {!isLoading && filteredResults.length > 0 && (
              <motion.div className="grid gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {/* Internal Results */}
                {filteredResults
                  .filter((result) => result.source === "internal")
                  .map((result) => (
                    <SearchResultCard
                      key={result.id}
                      result={result}
                      highlightText={query}
                      onSimplify={() => handleSimplify(result)}
                      onReadSimplified={handleReadSimplified}
                    />
                  ))}

                {/* Separator if both internal and external results exist */}
                {filteredResults.some((r) => r.source === "internal") &&
                  filteredResults.some((r) => r.source === "openalex" || r.source === "scholar") && (
                    <div className="flex items-center gap-3 my-6">
                      <div className="flex-1 h-px bg-border"></div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">External Sources</span>
                      </div>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                  )}

                {/* External Results */}
                {filteredResults
                  .filter((result) => result.source === "openalex" || result.source === "scholar")
                  .map((result) => (
                    <SearchResultCard
                      key={result.id}
                      result={result}
                      highlightText={query}
                      onSimplify={() => handleSimplify(result)}
                      onReadSimplified={handleReadSimplified}
                    />
                  ))}

                {/* End Message */}
                {filteredResults.length > 0 && (
                  <div className="flex items-center justify-center gap-2 py-6 mt-4">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-muted-foreground">
                      All {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"} loaded
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && filteredResults.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search query or filters</p>
              </motion.div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
