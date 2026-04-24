"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { reviewerArticlesService, categoriesApi } from "@/services"
import type { Article, Pagination } from "@/types/article"
import type { CategoryResponse } from "@/services/categories.service"
import { Search, Filter, Edit, CheckCircle, Layers, Clock, LayoutGrid, List as ListIcon, ChevronDown, FileText, BookOpen, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function AdminArticlesPage() {
  // Data States
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 12, total: 0, totalPages: 0
  })

  // Loading States
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter & View States
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<{id: string, title: string} | null>(null)

  // Ref to track if component is mounted to prevent state updates on unmount
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  // Debounce Search Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Initial Data Load (Categories)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesApi.getAll()
        if (isMounted.current && res.data.success) {
          setCategories(res.data.data)
        }
      } catch (error) {
        console.error("Failed to load categories", error)
      } finally {
        if (isMounted.current) setIsCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [])

  // Fetch Articles
  const fetchArticles = useCallback(async (page: number = 1) => {
    setIsLoading(true)
    try {
      const { data, pagination: paginationData } = await reviewerArticlesService.getArticles({
        page,
        limit: 12,
        search: debouncedSearch.trim() || undefined,
        categoryId: selectedCategory || undefined,
      })

      if (!isMounted.current) return

      // Client-side sorting
      let processedData = [...data]
      
      switch (sortBy) {
        case 'newest':
          processedData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          break
        case 'oldest':
          processedData.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
          break
        case 'title':
          processedData.sort((a, b) => a.title.localeCompare(b.title))
          break
      }

      setArticles(processedData)
      setPagination(paginationData)
    } catch (error: any) {
      if (isMounted.current) toast.error("Failed to load articles")
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [debouncedSearch, selectedCategory, sortBy])

  // Trigger Fetch
  useEffect(() => {
    fetchArticles(1)
  }, [fetchArticles])

  // Delete Handlers
  const confirmDelete = (id: string, title: string) => {
    setArticleToDelete({ id, title })
    setDeleteDialogOpen(true)
  }

  const handleExecuteDelete = async () => {
    if (!articleToDelete) return
    
    setIsDeleting(true)
    try {
        await reviewerArticlesService.deleteArticle(articleToDelete.id)
        toast.success("Article deleted successfully")
        setDeleteDialogOpen(false)
        fetchArticles(pagination.page) // Refresh list
    } catch (error: any) {
        toast.error("Failed to delete article", {
            description: error.message
        })
    } finally {
        setIsDeleting(false)
        setArticleToDelete(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchArticles(newPage)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  // Render Helpers
  const renderSkeletons = () => (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
      : "flex flex-col gap-4"
    }>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`bg-card border border-border rounded-xl overflow-hidden ${viewMode === 'list' ? 'flex flex-row h-48' : 'flex flex-col'}`}>
            <Skeleton className={viewMode === 'list' ? "w-72 h-full rounded-none" : "aspect-[16/9] w-full rounded-none"} />
            <div className="p-5 flex-1 flex flex-col gap-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
              <div className="mt-auto pt-3 flex justify-between">
                 <Skeleton className="h-3 w-1/4" />
                 <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="h-full bg-background p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Articles Management</h1>
        <p className="text-muted-foreground">Manage all articles in the platform</p>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col xl:flex-row xl:items-center gap-4 sticky top-0 z-10 backdrop-blur-md bg-card/95 supports-[backdrop-filter]:bg-card/80">
        
        {/* Search Input */}
        <div className="flex-1 relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="text"
                placeholder="Search by title, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
             
             {/* Category Filter */}
             <div className="flex-1 sm:flex-none min-w-[150px] relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={isCategoriesLoading}
                    className="w-full h-10 pl-9 pr-8 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer hover:bg-muted/30 transition-colors disabled:opacity-50"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="flex-1 sm:flex-none min-w-[150px] relative">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full h-10 pl-3 pr-8 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer hover:bg-muted/30 transition-colors"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title (A-Z)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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

      {/* Content Area */}
      {isLoading ? (
         renderSkeletons()
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
                Try adjusting your filters or search query.
            </p>
            {(debouncedSearch || selectedCategory) && (
                <button 
                    onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
                    className="text-sm text-primary hover:underline font-medium"
                >
                    Clear Filters
                </button>
            )}
         </motion.div>
      ) : (
         <AnimatePresence mode="popLayout">
            <motion.div 
                key={viewMode}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "flex flex-col gap-4"
                }
            >
                {articles.map((article, index) => (
                    <motion.div
                        key={article.id}
                        layout
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
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground/20">
                                            <BookOpen className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <StatusBadge isPublished={article.isPublished} />
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col gap-3">
                                    <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <div className="mt-auto pt-3 border-t border-border/50 flex justify-between text-xs text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDate(article.updatedAt)}</span>
                                        {article.authorName && <span className="truncate max-w-[100px]">by {article.authorName}</span>}
                                    </div>
                                </div>
                                <div className="p-3 bg-muted/40 border-t border-border flex gap-2">
                                    <Link href={`/admin/articles/${article.id}/edit`} className="flex-1 flex items-center justify-center gap-2 py-2 bg-background border border-border rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
                                        <Edit className="w-4 h-4" /> Edit
                                    </Link>
                                    <button 
                                        onClick={() => confirmDelete(article.id, article.title)}
                                        className="flex-none px-3 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all"
                                        title="Delete Article"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // LIST CARD
                            <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all flex flex-col sm:flex-row relative">
                                <div className="w-full sm:w-64 md:w-72 aspect-video sm:aspect-auto bg-muted relative overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-border/50">
                                    {article.imageUrl ? (
                                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground/20">
                                            <BookOpen className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 sm:left-auto sm:right-3">
                                        <StatusBadge isPublished={article.isPublished} />
                                    </div>
                                </div>
                                
                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                                         <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated {formatDate(article.updatedAt)}</span>
                                         {article.authorName && <span className="flex items-center gap-1.5 before:content-['•'] before:mr-2">by {article.authorName}</span>}
                                    </div>

                                    <h3 className="font-bold text-lg md:text-xl text-foreground mb-3 sm:mb-2 group-hover:text-primary transition-colors leading-tight">
                                        {article.title}
                                    </h3>
                                    
                                    <div className="mt-auto pt-4 sm:pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                                         <Link 
                                            href={`/admin/articles/${article.id}/edit`} 
                                            className="w-full sm:w-fit px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                                         >
                                            <Edit className="w-4 h-4" /> 
                                            Edit Article
                                         </Link>
                                         <button 
                                            onClick={() => confirmDelete(article.id, article.title)}
                                            className="w-full sm:w-fit px-5 py-2.5 bg-background border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                                         >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                         </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
         </AnimatePresence>
      )}

      {/* Pagination */}
      {!isLoading && articles.length > 0 && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 pb-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-border bg-card rounded-lg hover:bg-muted disabled:opacity-50 text-sm font-medium transition-colors"
               >
                  Previous
              </button>
              <span className="text-sm text-muted-foreground font-medium px-2">
                  Page {pagination.page} / {pagination.totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-border bg-card rounded-lg hover:bg-muted disabled:opacity-50 text-sm font-medium transition-colors"
              >
                  Next
              </button>
          </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <DialogTitle className="text-xl">Delete Article?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the article
                        <span className="font-semibold text-foreground"> "{articleToDelete?.title}" </span>
                        and remove all associated data.
                    </DialogDescription>
                </div>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleExecuteDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({ isPublished }: { isPublished: boolean }) {
    if (isPublished) {
        return (
            <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Published
            </span>
        )
    }
    return (
        <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-yellow-700 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1">
            <Layers className="w-3 h-3" /> Draft
        </span>
    )
}
