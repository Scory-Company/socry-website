"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { personalizationApi, authService, categoriesApi, type CategoryResponse } from "@/services"
import { Loader2, ChevronRight, Check } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

type ReadingLevel = 'SIMPLE' | 'STUDENT' | 'ACADEMIC' | 'EXPERT'

const MIN_CATEGORIES = 3

// Category icon mapping
const CATEGORY_ICONS: Record<string, string> = {
  Finance: "💰",
  Health: "🏥",
  Business: "💼",
  Science: "🔬",
  Technology: "💻",
  Education: "📚",
  Environment: "🌍",
  Social: "👥",
}

// Quiz questions
const QUIZ_QUESTIONS = [
  {
    id: 1,
    emoji: "📚",
    question: "What do you usually look for when reading?",
    subtitle: "Choose what best describes you",
    options: [
      { level: 'SIMPLE' as ReadingLevel, emoji: "⚡", text: "Quick understanding of main points" },
      { level: 'STUDENT' as ReadingLevel, emoji: "🎓", text: "Clear explanations with helpful context" },
      { level: 'ACADEMIC' as ReadingLevel, emoji: "📖", text: "Structured explanation with key concepts" },
      { level: 'EXPERT' as ReadingLevel, emoji: "🔬", text: "Complete discussion with technical details" },
    ]
  },
  {
    id: 2,
    emoji: "🎯",
    question: "How detailed do you want the explanations?",
    subtitle: "There's no right or wrong answer",
    options: [
      { level: 'SIMPLE' as ReadingLevel, emoji: "⚡", text: "Straight to the point, no extra details" },
      { level: 'STUDENT' as ReadingLevel, emoji: "💡", text: "Clear, with examples when needed" },
      { level: 'ACADEMIC' as ReadingLevel, emoji: "📊", text: "Structured and focused on concepts" },
      { level: 'EXPERT' as ReadingLevel, emoji: "🔍", text: "In-depth and precise, even if complex" },
    ]
  },
  {
    id: 3,
    emoji: "✍️",
    question: "Which explanation style is most comfortable for you?",
    subtitle: "Example: 'Why drinking water is important'",
    options: [
      { level: 'SIMPLE' as ReadingLevel, emoji: "💧", text: "Drinking water helps your body stay fresh and not easily tired." },
      { level: 'STUDENT' as ReadingLevel, emoji: "🌊", text: "Water keeps your body hydrated and helps you stay focused." },
      { level: 'ACADEMIC' as ReadingLevel, emoji: "⚗️", text: "Adequate hydration supports physical performance and cognitive processes." },
      { level: 'EXPERT' as ReadingLevel, emoji: "🧬", text: "Hydration plays a crucial role in maintaining cellular function and physiological balance." },
    ]
  },
]

// Reading level info
const READING_LEVELS = {
  SIMPLE: {
    title: "Simple & Direct",
    description: "You prefer ideas presented quickly and clearly, without complexity.",
    emoji: "⚡",
    features: [
      "Simple and easy to understand language",
      "Focus on main points",
      "Examples from everyday life"
    ]
  },
  STUDENT: {
    title: "Clear with Context",
    description: "You like explanations that balance clarity and detail.",
    emoji: "🎓",
    features: [
      "Main concepts explained simply",
      "Helpful examples and context",
      "Focus on understanding, not complex terms"
    ]
  },
  ACADEMIC: {
    title: "Structured & Conceptual",
    description: "You're comfortable with neat explanations using proper terminology.",
    emoji: "📖",
    features: [
      "Clear structure and flow",
      "Core concepts highlighted",
      "Relevant academic terms"
    ]
  },
  EXPERT: {
    title: "Technical & In-depth",
    description: "You're comfortable with complete and precise technical discussions.",
    emoji: "🔬",
    features: [
      "Comprehensive technical explanations",
      "Research and professional terminology",
      "Methods and mechanisms explained"
    ]
  }
}

export default function PersonalizationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<'quiz' | 'categories' | 'result'>('quiz')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<ReadingLevel[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchCategories()
  }, [])

  const checkAuth = async () => {
    if (!authService.isAuthenticated()) {
      router.push('/')
      return
    }
    setIsLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const calculateLevel = (): ReadingLevel => {
    const counts: Record<ReadingLevel, number> = {
      SIMPLE: 0,
      STUDENT: 0,
      ACADEMIC: 0,
      EXPERT: 0,
    }
    answers.forEach(level => counts[level]++)
    return Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as ReadingLevel
  }

  const handleAnswer = (level: ReadingLevel) => {
    const newAnswers = [...answers, level]
    setAnswers(newAnswers)

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setStep('categories')
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleContinue = () => {
    if (selectedCategories.length >= MIN_CATEGORIES) {
      setStep('result')
    }
  }

  const handleFinish = async () => {
    setIsSaving(true)
    try {
      const level = calculateLevel()
      await personalizationApi.saveSettings(level)
      await personalizationApi.saveTopicInterests(selectedCategories)
      
      toast.success("Personalization saved!", {
        description: "Your reading experience is now customized",
      })
      
      setTimeout(() => {
        router.push('/search')
      }, 1000)
    } catch (error: any) {
      toast.error("Failed to save", {
        description: error.message || "Please try again",
      })
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const progress = step === 'quiz' 
    ? ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 33
    : step === 'categories' ? 66 : 100

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 pt-12">
        <AnimatePresence mode="wait">
          {step === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Question */}
              <div className="text-center space-y-4">
                <div className="text-6xl">{QUIZ_QUESTIONS[currentQuestion].emoji}</div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                  </p>
                  <h1 className="text-3xl font-bold text-foreground">
                    {QUIZ_QUESTIONS[currentQuestion].question}
                  </h1>
                  <p className="text-muted-foreground">
                    {QUIZ_QUESTIONS[currentQuestion].subtitle}
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.level)}
                    className="w-full flex items-center gap-4 p-4 bg-card border-2 border-border hover:border-primary rounded-lg transition-all text-left group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="flex-1 text-foreground">
                      {option.text}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">🎯</div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    Choose Your Interests
                  </h1>
                  <p className="text-muted-foreground">
                    Select at least {MIN_CATEGORIES} topics to personalize your feed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id)
                  const categoryIcon = CATEGORY_ICONS[category.name] || "📚"
                  
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary'
                          : 'bg-card border-border hover:border-primary'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl">{categoryIcon}</div>
                        <p className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {category.name}
                        </p>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <button
                onClick={handleContinue}
                disabled={selectedCategories.length < MIN_CATEGORIES}
                className="w-full py-4 px-6 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold rounded-lg transition-colors"
              >
                Continue ({selectedCategories.length}/{MIN_CATEGORIES})
              </button>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {(() => {
                const level = calculateLevel()
                const info = READING_LEVELS[level]
                return (
                  <>
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-5xl">
                        {info.emoji}
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground font-medium">Your Reading Style</p>
                        <h1 className="text-3xl font-bold text-primary">{info.title}</h1>
                        <p className="text-lg text-foreground">{info.description}</p>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg border border-border space-y-4">
                      <h2 className="font-semibold text-foreground">What this means for you:</h2>
                      <ul className="space-y-3">
                        {info.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3 bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <span className="text-2xl">🎯</span>
                      <p className="text-sm text-muted-foreground">
                        Articles will adapt to your reading style
                      </p>
                    </div>

                    <button
                      onClick={handleFinish}
                      disabled={isSaving}
                      className="w-full py-4 px-6 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Start Reading! 🚀
                        </>
                      )}
                    </button>
                  </>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
