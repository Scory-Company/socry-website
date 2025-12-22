"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, CheckCircle, Bell } from "lucide-react"
import SearchResultCard from "@/components/client/SearchResultCard"
import FilterChip from "@/components/client/FilterChip"
import SearchSidebar from "@/components/client/SearchSidebar"
import ProfileDropdown from "@/components/client/ProfileDropdown"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useSearch } from "@/hooks/useSearch"
import { toast } from "sonner"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryParam = searchParams.get("q") || ""

  // Use custom hook for search logic
  const { 
    results, 
    isLoading, 
    isLoadingMore,
    hasMore,
    totalResults,
    search, 
    searchSource, 
    changeSource,
    loadMore 
  } = useSearch({
    initialQuery: queryParam,
    autoFetch: true,
    limit: 20,
    source: 'auto',
  })

  const [searchInput, setSearchInput] = useState(queryParam)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSource, setSelectedSource] = useState<"all" | "internal" | "external">("all")

  // Map UI source selection to API source
  const handleSourceChange = (uiSource: "all" | "internal" | "external") => {
    setSelectedSource(uiSource)
    
    // Map UI source to API source
    let apiSource: 'auto' | 'internal' | 'all' = 'auto'
    if (uiSource === 'internal') {
      apiSource = 'internal'
    } else if (uiSource === 'all' || uiSource === 'external') {
      apiSource = 'all' // Search all sources
    }
    
    changeSource(apiSource)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`)
      search(searchInput)
    } else {
      router.push("/search")
      search("")
    }
  }

  const handleSimplify = (result: any) => {
    toast.success("Simplification started!", {
      description: `Processing: "${result.title}"`,
    })
  }

  const handleReadSimplified = (articleId: string) => {
    router.push(`/article/${articleId}`)
  }

  const handleClearSearch = () => {
    setSearchInput("")
    router.push("/search")
    search("")
  }

  const handleClearCategory = () => {
    setSelectedCategory("All")
  }

  const handleClearAllFilters = () => {
    setSelectedCategory("All")
    setSelectedSource("all")
    handleSourceChange("all")
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
                {queryParam && <span className="text-muted-foreground"> for "{queryParam}"</span>}
              </h2>

              {/* Active Filters */}
              {(queryParam || selectedCategory !== "All") && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {queryParam && <FilterChip label={`"${queryParam.length > 20 ? queryParam.substring(0, 20) + "..." : queryParam}"`} onRemove={handleClearSearch} />}
                  {selectedCategory !== "All" && <FilterChip label={selectedCategory} onRemove={handleClearCategory} />}
                </div>
              )}

              {/* Clear All Button */}
              {(queryParam || selectedCategory !== "All") && (
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
                      highlightText={queryParam}
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
                      highlightText={queryParam}
                      onSimplify={() => handleSimplify(result)}
                      onReadSimplified={handleReadSimplified}
                    />
                  ))}

                {/* Load More / End Message */}
                {filteredResults.length > 0 && (
                  <div className="flex flex-col items-center gap-3 py-6 mt-4">
                    {/* Results Count */}
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Showing {filteredResults.length} of {totalResults} {totalResults === 1 ? "result" : "results"}
                      </span>
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                      <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark-shade text-primary-foreground rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isLoadingMore ? (
                          <>
                            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>Load More</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
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
