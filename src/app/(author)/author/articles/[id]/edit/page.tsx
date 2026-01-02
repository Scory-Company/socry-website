"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { reviewerArticlesService, simplificationService } from "@/services"
import type { Article, Quiz } from "@/services/reviewerArticles.service"
import { BlockRenderer, ContentBlock, BlockEditor, QuizBuilder, EmptyContentState } from "@/components/article"
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle, Eye, Edit as EditIcon, Image as ImageIcon, User, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"

type ReadingLevel = 'SIMPLE' | 'STUDENT' | 'ACADEMIC' | 'EXPERT'

interface ArticleWithContent extends Article {
  contents?: Array<{
    id: string
    readingLevel: ReadingLevel
    blocks: ContentBlock[]
  }>
  quizzes?: Array<Quiz & { readingLevel: ReadingLevel }>
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  // Data states
  const [article, setArticle] = useState<ArticleWithContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form states - Metadata
  const [title, setTitle] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  
  // Form states - Content per reading level
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('SIMPLE')
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  
  // UI states
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content')
  const [showPreview, setShowPreview] = useState(false)
  const [isRegeneratingMode, setIsRegeneratingMode] = useState(false)
  
  // Track changes per reading level
  const [levelChanges, setLevelChanges] = useState<Record<ReadingLevel, {
    blocksModified: boolean
    quizzesModified: boolean
    blocks: ContentBlock[]
    quizzes: Quiz[]
  }>>({
    SIMPLE: { blocksModified: false, quizzesModified: false, blocks: [], quizzes: [] },
    STUDENT: { blocksModified: false, quizzesModified: false, blocks: [], quizzes: [] },
    ACADEMIC: { blocksModified: false, quizzesModified: false, blocks: [], quizzes: [] },
    EXPERT: { blocksModified: false, quizzesModified: false, blocks: [], quizzes: [] },
  })

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await reviewerArticlesService.getArticleById(articleId) as ArticleWithContent
        
        setArticle(data)
        setTitle(data.title)
        setAuthorName(data.authorName || "")
        setImageUrl(data.imageUrl || "")
        setIsPublished(data.isPublished)
        
        // Load all reading levels data
        const levels: ReadingLevel[] = ['SIMPLE', 'STUDENT', 'ACADEMIC', 'EXPERT']
        const newLevelChanges = { ...levelChanges }
        
        levels.forEach(level => {
          const content = data.contents?.find(c => c.readingLevel === level)
          const levelQuizzes = data.quizzes?.filter(q => q.readingLevel === level) || []
          
          newLevelChanges[level] = {
            blocksModified: false,
            quizzesModified: false,
            blocks: (content?.blocks || []) as ContentBlock[],
            quizzes: levelQuizzes,
          }
        })
        
        setLevelChanges(newLevelChanges)
        
        // Set current level data
        setBlocks(newLevelChanges[readingLevel].blocks)
        setQuizzes(newLevelChanges[readingLevel].quizzes)
        
      } catch (error: any) {
        toast.error("Failed to fetch article", {
          description: error.message,
        })
        router.push('/author/articles')
      } finally {
        setIsLoading(false)
      }
    }

    if (articleId) {
      fetchArticle()
    }
  }, [articleId])

  // Handle reading level change - save current level data first
  const handleReadingLevelChange = (newLevel: ReadingLevel) => {
    // 1. Save current level data to state history
    const currentData = {
      blocks: blocks,
      quizzes: quizzes,
      blocksModified: levelChanges[readingLevel].blocksModified,
      quizzesModified: levelChanges[readingLevel].quizzesModified,
    }

    setLevelChanges(prev => ({
      ...prev,
      [readingLevel]: {
        ...prev[readingLevel], // Preserve structure
        ...currentData,
      }
    }))
    
    // 2. Switch to new level and load its data
    setReadingLevel(newLevel)
    
    // Safety check: ensure level exists in history
    const nextLevelData = levelChanges[newLevel]
    setBlocks(nextLevelData?.blocks || [])
    setQuizzes(nextLevelData?.quizzes || [])
    
    // Reset other UI states
    setIsRegeneratingMode(false)
    setShowPreview(false)
  }

  // Handle blocks change
  const handleBlocksChange = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks)
    setLevelChanges(prev => ({
      ...prev,
      [readingLevel]: {
        ...prev[readingLevel],
        blocks: newBlocks,
        blocksModified: true,
      }
    }))
  }

  // Handle quizzes change
  const handleQuizzesChange = (newQuizzes: Quiz[]) => {
    setQuizzes(newQuizzes)
    setLevelChanges(prev => ({
      ...prev,
      [readingLevel]: {
        ...prev[readingLevel],
        quizzes: newQuizzes,
        quizzesModified: true,
      }
    }))
  }

  // Handle AI content generation from PDF
  const handleGenerateContent = async (pdfUrl: string) => {
    try {
      toast.info("Generating content with AI...", {
        description: "This may take 10-30 seconds"
      })

      const response = await simplificationService.resimplifyArticle(
        articleId,
        readingLevel,
        pdfUrl
      )

      // Update blocks and quizzes with AI-generated content
      const newBlocks = response.data.content as ContentBlock[]
      const newQuizzes = response.data.quiz.map((q, index) => ({
        question: q.question || "Generated Question",
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: q.correctAnswer || "",
        explanation: q.explanation || "",
        order: index + 1
      }))

      setBlocks(newBlocks)
      setQuizzes(newQuizzes)

      // Mark as modified
      setLevelChanges(prev => ({
        ...prev,
        [readingLevel]: {
          blocks: newBlocks,
          quizzes: newQuizzes,
          blocksModified: true,
          quizzesModified: true,
        }
      }))

      toast.success("Content generated successfully!", {
        description: `Generated ${newBlocks.length} blocks and ${newQuizzes.length} quizzes`
      })

      setIsRegeneratingMode(false)

      // Auto-save without redirecting
      setTimeout(() => {
        handleSave(false)
      }, 1000)

    } catch (error: any) {
      toast.error("Failed to generate content", {
        description: error.message
      })
      throw error // Propagate error for UI handling
    }
  }

  // Validate before save
  const validate = (): boolean => {
    if (!title.trim()) {
      toast.error("Title is required")
      return false
    }
    
    if (title.trim().length < 5) {
      toast.error("Title must be at least 5 characters")
      return false
    }
    
    return true
  }

  // Handle save
  const handleSave = async (shouldRedirect = true) => {
    if (!validate()) return
    
    setIsSaving(true)
    
    try {
      // 1. Update article metadata
      await reviewerArticlesService.updateArticle(articleId, {
        title: title.trim(),
        isPublished,
        authorName: authorName.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      })

      // 2. Update content for all modified reading levels
      const levels: ReadingLevel[] = ['SIMPLE', 'STUDENT', 'ACADEMIC', 'EXPERT']
      
      for (const level of levels) {
        const levelData = levelChanges[level]
        
        // Update blocks if modified
        if (levelData.blocksModified && levelData.blocks.length > 0) {
          const mappedBlocks = levelData.blocks.map(block => ({
            type: block.type,
            data: {
              ...(block.data.text && { text: block.data.text }),
              ...(block.data.level && { level: block.data.level }),
              ...(block.data.style && { style: block.data.style }),
              ...(block.data.items && { items: block.data.items }),
              ...(block.data.author && { author: block.data.author }),
              ...(block.data.variant && { variant: block.data.variant }),
              ...(block.data.url && { url: block.data.url }),
              ...(block.data.alt && { alt: block.data.alt }),
              ...(block.data.caption && { caption: block.data.caption }),
            }
          }))
          
          await reviewerArticlesService.updateContent(articleId, {
            readingLevel: level,
            blocks: mappedBlocks,
          } as any)
        }
        
        // Update quizzes if modified
        if (levelData.quizzesModified && levelData.quizzes.length > 0) {
          const cleanedQuizzes = levelData.quizzes.map((quiz, index) => ({
            question: String(quiz.question || ""),
            options: Array.isArray(quiz.options) ? quiz.options.map(String) : [],
            correctAnswer: String(quiz.correctAnswer || ""),
            explanation: String(quiz.explanation || ""),
            order: index + 1,
          }))
          
          await reviewerArticlesService.updateQuizzes(articleId, {
            readingLevel: level,
            quizzes: cleanedQuizzes,
          })
        }
      }

      toast.success("Article saved successfully!")
      
      if (shouldRedirect) {
        router.push('/author/articles')
      }
      
    } catch (error: any) {
      toast.error("Failed to update article", {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!article) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="border-b border-border bg-card sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/author/articles"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Edit Article</h1>
                <p className="text-sm text-muted-foreground">{article.slug}</p>
              </div>
            </div>
            
            {/* Right: Status + Save */}
            <div className="flex items-center gap-3">
              {isPublished ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <XCircle className="w-4 h-4" />
                  Draft
                </span>
              )}
              
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all flex items-center gap-2 font-medium disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Metadata */}
          <div className="lg:col-span-1 space-y-6">
            {/* Metadata Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6"
            >
              <h2 className="text-lg font-semibold text-foreground">Article Metadata</h2>
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter article title..."
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Author Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Enter author name..."
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Thumbnail Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {imageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-border">
                    <img
                      src={imageUrl}
                      alt="Thumbnail preview"
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        e.currentTarget.src = ""
                        toast.error("Invalid image URL")
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Publish Status */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-foreground cursor-pointer">
                  Publish this article
                </label>
              </div>
            </motion.div>

            {/* Reading Level Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Reading Level</h2>
              <div className="grid grid-cols-2 gap-2">
                {(['SIMPLE', 'STUDENT', 'ACADEMIC', 'EXPERT'] as ReadingLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleReadingLevelChange(level)}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                      readingLevel === level
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Content Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
            >
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 px-6 py-4 font-medium transition-all ${
                    activeTab === 'content'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex-1 px-6 py-4 font-medium transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  Quiz (3 questions)
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'content' ? (
                  <div className="space-y-4">
                    {/* Preview/Edit/Regenerate Controls */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        Content for {readingLevel} Level
                      </h3>
                      <div className="flex items-center gap-2">
                        {/* Only show Re-simplify if content exists */}
                        {blocks.length > 0 && (
                          <button
                            onClick={() => setIsRegeneratingMode(!isRegeneratingMode)}
                            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium border ${
                              isRegeneratingMode
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                : 'bg-background text-foreground border-border hover:bg-muted'
                            }`}
                          >
                            {isRegeneratingMode ? (
                              <>
                                <XCircle className="w-4 h-4" />
                                Cancel
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4" />
                                Re-simplify with AI
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (isRegeneratingMode) setIsRegeneratingMode(false)
                            setShowPreview(!showPreview)
                          }}
                          className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                        >
                          {showPreview ? (
                            <>
                              <EditIcon className="w-4 h-4" />
                              Edit
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Preview
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Editor or Preview or Empty State or Regenerate State */}
                    {isRegeneratingMode ? (
                      <EmptyContentState
                        readingLevel={readingLevel}
                        onGenerate={handleGenerateContent}
                        title={`Re-simplify ${readingLevel} Article`}
                        description="Upload a different PDF or re-process the current one to generate new content. Warning: This will overwrite existing content."
                      />
                    ) : blocks.length === 0 && !showPreview ? (
                      <EmptyContentState
                        readingLevel={readingLevel}
                        onGenerate={handleGenerateContent}
                      />
                    ) : showPreview ? (
                      <div className="prose prose-sm max-w-none bg-background border border-border rounded-lg p-6">
                        {blocks.map((block, index) => (
                          <BlockRenderer key={index} block={block} index={index} />
                        ))}
                      </div>
                    ) : (
                      <BlockEditor
                        key={`editor-${readingLevel}`} // Force re-mount on level change to fix bugs
                        blocks={blocks}
                        onChange={handleBlocksChange}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Quiz for {readingLevel} Level
                    </h3>
                    <QuizBuilder
                      key={`quiz-${readingLevel}`} // Force re-mount on level change to fix bugs
                      quizzes={quizzes}
                      onChange={handleQuizzesChange}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
