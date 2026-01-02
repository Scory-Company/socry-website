"use client"

import { useState, useEffect, useCallback } from "react"
import { reviewerArticlesService, categoriesApi } from "@/services" 
import type { Article, Pagination } from "@/services/reviewerArticles.service"
import type { CategoryResponse } from "@/services/categories.service" 
import { Search, Filter, FileText, Edit, CheckCircle, XCircle, Loader2, Calendar, Clock, Layers, ArrowRight, BookOpen, ChevronDown, ListFilter, SortAsc, LayoutGrid, List as ListIcon } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthorArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 12, total: 0, totalPages: 0
  })
  
  const [categories, setCategories] = useState<CategoryResponse[]>([]) 

  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filters & View Mode
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid') 

  // Fetch Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
        try {
            const res = await categoriesApi.getAll();
            if (res.data.success) {
                setCategories(res.data.data);
            }
        } catch (error) {
            console.error("Failed to load categories");
        }
    }
    loadCategories();
  }, [])

  // Fetch Logic
  const fetchArticles = useCallback(async (page: number = 1, query: string = searchQuery) => {
    setIsLoading(true)
    try {
      const { data, pagination: paginationData } = await reviewerArticlesService.getArticles({
        page,
        limit: 12,
        search: query.trim() || undefined,
        categoryId: selectedCategory || undefined, 
      })

      // Client-side Search Filter 
      let processedData = data;
      if (query.trim()) {
         const lowerQ = query.toLowerCase().trim();
         processedData = processedData.filter(item => 
             item.title.toLowerCase().includes(lowerQ) || 
             (item.authorName && item.authorName.toLowerCase().includes(lowerQ))
         );
      }

      // Client-side Sorting
      if (sortBy === 'newest') {
          processedData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      } else if (sortBy === 'oldest') {
          processedData.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      } else if (sortBy === 'title') {
          processedData.sort((a, b) => a.title.localeCompare(b.title));
      }

      setArticles(processedData)
      setPagination(paginationData)
    } catch (error: any) {
      toast.error("Failed to load articles")
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, sortBy]) 

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchArticles(1, searchQuery);
    }, 400); 
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy, fetchArticles]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">My Articles</h1>
        <p className="text-muted-foreground">Manage your simplified content library</p>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col xl:flex-row xl:items-center gap-4 sticky top-4 z-20 backdrop-blur-md bg-card/95">
        
        {/* Search Input */}
        <div className="flex-1 relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                    <XCircle className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
            )}
        </div>

        {/* Filters Group & View Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
             
             {/* Category Filter */}
             <div className="flex-1 sm:flex-none min-w-[150px] relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 pl-9 pr-8 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer hover:bg-muted/30 transition-colors"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            {/* Sort Filter */}
            <div className="flex-1 sm:flex-none min-w-[150px] relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <ListFilter className="w-4 h-4 text-muted-foreground" />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full h-10 pl-9 pr-8 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer hover:bg-muted/30 transition-colors"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title (A-Z)</option>
                </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                    title="Grid View"
                >
                    <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                    title="List View"
                >
                    <ListIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
          {isLoading ? (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
             >
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground text-sm">Loading articles...</p>
             </motion.div>
          ) : articles.length === 0 ? (
             <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-2xl bg-card/30"
             >
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No articles found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">
                    {searchQuery 
                        ? `No matches for "${searchQuery}"` 
                        : selectedCategory 
                            ? "No articles in this category."
                            : "You haven't created any articles yet."}
                </p>
                {(searchQuery || selectedCategory) && (
                    <button 
                        onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        Clear Filters
                    </button>
                )}
             </motion.div>
          ) : (
             <motion.div 
                key={viewMode}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "flex flex-col gap-4"
                }
             >
                {articles.map((article, index) => (
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {viewMode === 'grid' ? (
                            // GRID CARD
                            <div className="group h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all flex flex-col relative w-full">
                                <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                                    {article.imageUrl ? (
                                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50"><BookOpen className="w-10 h-10 text-muted-foreground/20" /></div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {article.isPublished ? 
                                            <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Published</span> : 
                                            <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-yellow-700 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1"><Layers className="w-3 h-3" /> Draft</span>
                                        }
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col gap-3">
                                    <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                                    <div className="mt-auto pt-3 border-t border-border/50 flex justify-between text-xs text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDate(article.updatedAt)}</span>
                                        {article.authorName && <span className="truncate max-w-[100px]">{article.authorName}</span>}
                                    </div>
                                </div>
                                <div className="p-3 bg-muted/40 border-t border-border">
                                    <Link href={`/author/articles/${article.id}/edit`} className="flex items-center justify-center gap-2 w-full py-2 bg-background border border-border rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all"><Edit className="w-4 h-4" /> Edit</Link>
                                </div>
                            </div>
                        ) : (
                            // LIST CARD (Responsive Enhanced)
                            <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all flex flex-col sm:flex-row relative">
                                {/* Image: Full width on mobile, Fixed on Desktop */}
                                <div className="w-full sm:w-64 md:w-72 aspect-video sm:aspect-auto bg-muted relative overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-border/50">
                                    {article.imageUrl ? (
                                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50"><BookOpen className="w-10 h-10 text-muted-foreground/20" /></div>
                                    )}
                                     {/* Status Badge in Image for List View (Better visibility) */}
                                     <div className="absolute top-3 left-3 sm:left-auto sm:right-3">
                                         {article.isPublished ? 
                                            <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Published</span> : 
                                            <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-yellow-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1"><Layers className="w-3 h-3" /> Draft</span>
                                        }
                                     </div>
                                </div>
                                
                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center min-w-0">
                                    {/* Meta Row */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                                         <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated {formatDate(article.updatedAt)}</span>
                                         {article.authorName && <span className="flex items-center gap-1.5 before:content-['•'] before:mr-2">by {article.authorName}</span>}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-bold text-lg md:text-xl text-foreground mb-3 sm:mb-2 group-hover:text-primary transition-colors leading-tight">
                                        {article.title}
                                    </h3>
                                    
                                    {/* Action Row */}
                                    <div className="mt-auto pt-4 sm:pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                                         <Link 
                                            href={`/author/articles/${article.id}/edit`} 
                                            className="w-full sm:w-fit px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                                         >
                                            <Edit className="w-4 h-4" /> 
                                            Edit Article
                                         </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
             </motion.div>
          )}
      </AnimatePresence>

      {/* Pagination */}
      {!isLoading && articles.length > 0 && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
              <button 
                onClick={() => fetchArticles(pagination.page - 1, searchQuery)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-border bg-card rounded-lg hover:bg-muted disabled:opacity-50 text-sm font-medium transition-colors"
              >
                  Previous
              </button>
              <span className="text-sm text-muted-foreground font-medium px-2">
                  Page {pagination.page} / {pagination.totalPages}
              </span>
              <button 
                onClick={() => fetchArticles(pagination.page + 1, searchQuery)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-border bg-card rounded-lg hover:bg-muted disabled:opacity-50 text-sm font-medium transition-colors"
              >
                  Next
              </button>
          </div>
      )}
    </div>
  )
}
