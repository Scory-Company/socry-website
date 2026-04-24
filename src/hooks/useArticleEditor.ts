"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Article, ContentBlock, Quiz, ReadingLevel, UpdateContentData, UpdateQuizzesData } from "@/types/article"
import type { SimplifyResponse } from "@/services/simplification.service"

// --- Service interfaces ---

export interface ArticleEditorService {
  getArticleById(id: string): Promise<Article>
  updateArticle(id: string, data: Partial<Article>): Promise<Article>
  updateContent(articleId: string, data: UpdateContentData): Promise<void>
  updateQuizzes(articleId: string, data: UpdateQuizzesData): Promise<void>
}

export interface SimplificationEditorService {
  resimplifyArticle(articleId: string, readingLevel: ReadingLevel, pdfUrl?: string): Promise<SimplifyResponse>
}

export interface UseArticleEditorOptions {
  articleId: string
  articleService: ArticleEditorService
  simplificationService: SimplificationEditorService
  redirectPath: string
}

// --- Internal types ---

const READING_LEVELS: ReadingLevel[] = ['SIMPLE', 'STUDENT', 'ACADEMIC', 'EXPERT']

type LevelState = {
  blocksModified: boolean
  quizzesModified: boolean
  blocks: ContentBlock[]
  quizzes: Quiz[]
}

type LevelChanges = Record<ReadingLevel, LevelState>

function initLevelChanges(): LevelChanges {
  return {
    SIMPLE: { blocksModified: false, quizzesModified: false, blocks: [], quizzes: [] },
    STUDENT: { blocksModified: false, quizzesModified: false, blocks: [], quizzes: [] },
    ACADEMIC: { blocksModified: false, quizzesModified: false, blocks: [], quizzes: [] },
    EXPERT: { blocksModified: false, quizzesModified: false, blocks: [], quizzes: [] },
  }
}

function mapBlockForSave(block: ContentBlock): ContentBlock {
  let type: string = 'paragraph'
  if (block.type === 'heading') type = 'heading'
  else if (block.type === 'image') type = 'image'
  else if (block.type === 'list') type = 'list'
  else if (block.type === 'text') type = 'paragraph'

  return {
    type,
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
    },
  }
}

// --- Hook ---

export function useArticleEditor({
  articleId,
  articleService,
  simplificationService,
  redirectPath,
}: UseArticleEditorOptions) {
  const router = useRouter()
  const isMounted = useRef(true)

  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Metadata
  const [articleTitle, setArticleTitle] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  // Content
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('SIMPLE')
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [levelChanges, setLevelChanges] = useState<LevelChanges>(initLevelChanges)

  // UI
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content')
  const [showPreview, setShowPreview] = useState(false)
  const [isRegeneratingMode, setIsRegeneratingMode] = useState(false)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  useEffect(() => {
    if (!articleId) return

    const fetchArticle = async () => {
      try {
        const data = await articleService.getArticleById(articleId)
        if (!isMounted.current) return

        setArticle(data)
        setArticleTitle(data.title)
        setAuthorName(data.authorName || "")
        setImageUrl(data.imageUrl || "")
        setIsPublished(data.isPublished)

        const initial = initLevelChanges()
        READING_LEVELS.forEach(level => {
          const content = data.contents?.find(c => c.readingLevel === level)
          const levelQuizzes = data.quizzes?.filter(q => q.readingLevel === level) || []
          initial[level] = {
            blocksModified: false,
            quizzesModified: false,
            blocks: (content?.blocks || []) as ContentBlock[],
            quizzes: levelQuizzes,
          }
        })

        setLevelChanges(initial)
        setBlocks(initial['SIMPLE'].blocks)
        setQuizzes(initial['SIMPLE'].quizzes)
      } catch (error: any) {
        if (isMounted.current) {
          toast.error("Failed to fetch article", { description: error.message })
          router.push(redirectPath)
        }
      } finally {
        if (isMounted.current) setIsLoading(false)
      }
    }

    fetchArticle()
  }, [articleId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleReadingLevelChange = (newLevel: ReadingLevel) => {
    setLevelChanges(prev => ({
      ...prev,
      [readingLevel]: { ...prev[readingLevel], blocks, quizzes },
    }))
    setReadingLevel(newLevel)
    setBlocks(levelChanges[newLevel]?.blocks || [])
    setQuizzes(levelChanges[newLevel]?.quizzes || [])
    setIsRegeneratingMode(false)
    setShowPreview(false)
  }

  const handleBlocksChange = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks)
    setLevelChanges(prev => ({
      ...prev,
      [readingLevel]: { ...prev[readingLevel], blocks: newBlocks, blocksModified: true },
    }))
  }

  const handleQuizzesChange = (newQuizzes: Quiz[]) => {
    setQuizzes(newQuizzes)
    setLevelChanges(prev => ({
      ...prev,
      [readingLevel]: { ...prev[readingLevel], quizzes: newQuizzes, quizzesModified: true },
    }))
  }

  const handleGenerateContent = async (pdfUrl: string) => {
    try {
      toast.info("Generating content with AI...", { description: "This may take 10-30 seconds" })

      const response = await simplificationService.resimplifyArticle(articleId, readingLevel, pdfUrl)
      if (!isMounted.current) return

      const newBlocks = response.data.content as ContentBlock[]
      const newQuizzes: Quiz[] = response.data.quiz.map((q, index) => ({
        question: q.question || "Generated Question",
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: q.correctAnswer || "",
        explanation: q.explanation || "",
        order: index + 1,
      }))

      setBlocks(newBlocks)
      setQuizzes(newQuizzes)
      setLevelChanges(prev => ({
        ...prev,
        [readingLevel]: { blocks: newBlocks, quizzes: newQuizzes, blocksModified: true, quizzesModified: true },
      }))

      toast.success("Content generated successfully!", {
        description: `Generated ${newBlocks.length} blocks and ${newQuizzes.length} quizzes`,
      })
      setIsRegeneratingMode(false)

      setTimeout(() => {
        if (isMounted.current) handleSave(false)
      }, 1000)
    } catch (error: any) {
      if (isMounted.current) {
        toast.error("Failed to generate content", { description: error.message })
      }
    }
  }

  const validate = (currentBlocks: ContentBlock[], currentQuizzes: Quiz[]): boolean => {
    if (!articleTitle.trim()) {
      toast.error("Title is required")
      return false
    }
    if (articleTitle.trim().length < 5) {
      toast.error("Title must be at least 5 characters")
      return false
    }

    for (const level of READING_LEVELS) {
      const levelData = level === readingLevel
        ? { quizzes: currentQuizzes, quizzesModified: levelChanges[level].quizzesModified }
        : levelChanges[level]

      if (!levelData.quizzesModified || levelData.quizzes.length === 0) continue

      for (const [index, quiz] of levelData.quizzes.entries()) {
        if (!quiz.question?.trim()) {
          toast.error(`Question ${index + 1} in ${level} level is missing text`)
          if (level !== readingLevel) handleReadingLevelChange(level)
          setActiveTab('quiz')
          return false
        }
        if (!Array.isArray(quiz.options) || quiz.options.length < 2) {
          toast.error(`Question ${index + 1} in ${level} level needs at least 2 options`)
          if (level !== readingLevel) handleReadingLevelChange(level)
          setActiveTab('quiz')
          return false
        }
        if (quiz.options.some(opt => !opt.trim())) {
          toast.error(`Question ${index + 1} in ${level} has empty options`)
          if (level !== readingLevel) handleReadingLevelChange(level)
          setActiveTab('quiz')
          return false
        }
        if (!quiz.correctAnswer?.trim()) {
          toast.error(`Question ${index + 1} in ${level} level needs a correct answer`)
          if (level !== readingLevel) handleReadingLevelChange(level)
          setActiveTab('quiz')
          return false
        }
      }
    }

    return true
  }

  const handleSave = async (shouldRedirect = true) => {
    if (isSaving) return
    if (!validate(blocks, quizzes)) return

    setIsSaving(true)

    try {
      const updatePromises: Promise<any>[] = []

      updatePromises.push(
        articleService.updateArticle(articleId, {
          title: articleTitle.trim(),
          isPublished,
          authorName: authorName.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        }).then(() => ({ type: 'metadata', status: 'success' }))
      )

      for (const level of READING_LEVELS) {
        const isCurrent = level === readingLevel
        const blocksToUse = isCurrent ? blocks : levelChanges[level].blocks
        const quizzesToUse = isCurrent ? quizzes : levelChanges[level].quizzes
        const { blocksModified, quizzesModified } = levelChanges[level]

        if (blocksModified && blocksToUse.length > 0) {
          updatePromises.push(
            articleService.updateContent(articleId, {
              readingLevel: level,
              blocks: blocksToUse.map(mapBlockForSave),
            }).then(() => ({ type: `content-${level}`, status: 'success' }))
          )
        }

        if (quizzesModified && quizzesToUse.length > 0) {
          const cleanedQuizzes = quizzesToUse.map((quiz, index) => ({
            question: String(quiz.question || "").trim(),
            options: Array.isArray(quiz.options) ? quiz.options.map(o => String(o).trim()).filter(Boolean) : [],
            correctAnswer: String(quiz.correctAnswer || "").trim(),
            explanation: String(quiz.explanation || "").trim(),
            order: index + 1,
          }))

          if (cleanedQuizzes.every(q => q.question && q.options.length >= 2 && q.correctAnswer)) {
            updatePromises.push(
              articleService.updateQuizzes(articleId, {
                readingLevel: level,
                quizzes: cleanedQuizzes,
              }).then(() => ({ type: `quizzes-${level}`, status: 'success' }))
            )
          }
        }
      }

      const results = await Promise.allSettled(updatePromises)
      const rejected = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[]
      const fulfilled = results.filter(r => r.status === 'fulfilled')

      if (rejected.length > 0) {
        toast[fulfilled.length > 0 ? 'warning' : 'error'](
          fulfilled.length > 0
            ? "Saved with some errors. Content might be partially updated."
            : "Failed to save changes. Please try again."
        )
        return
      }

      toast.success("Article saved successfully!")

      if (shouldRedirect) {
        router.push(redirectPath)
      } else {
        setLevelChanges(prev => {
          const reset = { ...prev }
          for (const key of READING_LEVELS) {
            reset[key] = { ...reset[key], blocksModified: false, quizzesModified: false }
          }
          return reset
        })
      }
    } catch (error: any) {
      if (isMounted.current) {
        toast.error("Failed to update article", {
          description: error.response?.data?.message || 'Something went wrong',
        })
      }
    } finally {
      if (isMounted.current) setIsSaving(false)
    }
  }

  return {
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
  }
}
