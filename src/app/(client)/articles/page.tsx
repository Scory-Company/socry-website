"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Filter, ChevronDown, Grid3x3, List, 
  TrendingUp, Clock, Star, Sparkles, BookOpen
} from "lucide-react"
import PublicNavbar from "@/components/client/PublicNavbar"
import Footer from "@/components/client/Footer"
import { ArticleCard } from "@/components/shared/ArticleCard"
import { articlesApi, type ArticleResponse } from "@/services/articles.service"
import { toast } from "sonner"

export default function ArticlesPage() {
  const router = useRouter()
  
  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'top_rated' | 'trending'>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        
        const response = await articlesApi.getArticles({
          page: currentPage,
          limit: 12,
          sort: sortBy,
          category: selectedCategory,
        })

        if (response.data.success) {
          setArticles(response.data.data.articles)
          setTotalPages(response.data.data.pagination.totalPages)
          setTotalArticles(response.data.data.pagination.total)
        }
      } catch (error: any) {
        console.error('Error fetching articles:', error)
        toast.error('Failed to load articles', {
          description: error.response?.data?.message || 'Please try again later',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [currentPage, sortBy, selectedCategory])

  // Convert ArticleResponse to Article format
  const convertToArticleFormat = (article: ArticleResponse) => ({
    id: parseInt(article.id.substring(0, 8), 16) || 0,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    image: article.imageUrl || '',
    author: article.authorName,
    authorAvatar: article.authorAvatar,
    category: article.category.name,
    rating: article.rating,
    reads: article.viewCount >= 1000
      ? `${(article.viewCount / 1000).toFixed(1)}k reads`
      : `${article.viewCount || 0} reads`,
    readTime: article.readTimeMinutes,
    views: article.viewCount,
    publishedAt: article.publishedAt,
    status: 'Published' as const,
  })

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: Clock },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'top_rated', label: 'Top Rated', icon: Star },
    { value: 'trending', label: 'Trending', icon: Sparkles },
  ]

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Articles", link: "/articles" },
    { name: "How It Works", link: "/#how-it-works" },
  ]

  return (
    <div className="relative min-h-screen w-full bg-background">
      <PublicNavbar navItems={navItems} showAuthButtons={true} />

      {/* Main Content */}
      <main className="relative pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
              All <span className="text-primary">Articles</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {totalArticles} articles available • Simplified for everyone
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any)
                    setCurrentPage(1)
                  }}
                  className="appearance-none bg-card border-2 border-border rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {selectedCategory && (
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-primary">{selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory(undefined)}
                    className="text-primary hover:text-primary-dark-shade text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-card border-2 border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border-2 border-border rounded-xl p-5 animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              ))}
            </div>
          )}

          {/* Articles Grid/List */}
          {!isLoading && articles.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}
            >
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ArticleCard article={convertToArticleFormat(article)} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && articles.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground mb-6">
                {selectedCategory 
                  ? `No articles found in ${selectedCategory} category`
                  : "No articles available at the moment"}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary-dark-shade transition-colors font-medium"
                >
                  View All Categories
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && articles.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 bg-card border-2 border-border rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-11 h-11 rounded-xl font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border-2 border-border hover:border-primary/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 bg-card border-2 border-border rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
