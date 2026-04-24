"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  ArrowLeft, Save, Loader2, CheckCircle, XCircle,
  Eye, Edit as EditIcon, Image as ImageIcon, User, RefreshCw,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { BlockRenderer, BlockEditor, QuizBuilder, EmptyContentState } from "@/components/article"
import type { ContentBlock } from "@/components/article"
import type { Quiz, ReadingLevel } from "@/types/article"
import type { useArticleEditor } from "@/hooks/useArticleEditor"

const READING_LEVELS: ReadingLevel[] = ['SIMPLE', 'STUDENT', 'ACADEMIC', 'EXPERT']

type EditorState = ReturnType<typeof useArticleEditor>

interface ArticleEditorShellProps extends EditorState {
  title: string
  backHref: string
}

export function ArticleEditorShell({
  title,
  backHref,
  article,
  isLoading,
  isSaving,
  articleTitle, setArticleTitle,
  authorName, setAuthorName,
  imageUrl, setImageUrl,
  isPublished, setIsPublished,
  readingLevel,
  blocks,
  quizzes,
  activeTab, setActiveTab,
  showPreview, setShowPreview,
  isRegeneratingMode, setIsRegeneratingMode,
  handleReadingLevelChange,
  handleBlocksChange,
  handleQuizzesChange,
  handleGenerateContent,
  handleSave,
}: ArticleEditorShellProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card sticky top-0 z-20 h-16 flex items-center px-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full rounded-xl" />
          </div>
        </div>
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
            <div className="flex items-center gap-4">
              <Link
                href={backHref}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Back to articles"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">{article.slug}</p>
              </div>
            </div>

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
          {/* Left: Metadata + Reading Level */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6"
            >
              <h2 className="text-lg font-semibold text-foreground">Article Metadata</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter article title..."
                />
              </div>

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

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Reading Level</h2>
              <div className="grid grid-cols-2 gap-2">
                {READING_LEVELS.map((level) => (
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
            >
              {/* Tabs */}
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

              <div className="p-6">
                {activeTab === 'content' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        Content for {readingLevel} Level
                      </h3>
                      <div className="flex items-center gap-2">
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
                        key={`editor-${readingLevel}`}
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
                      key={`quiz-${readingLevel}`}
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
