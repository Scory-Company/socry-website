"use client"

import { useState, useEffect } from "react"
import { Quiz } from "@/services/reviewerArticles.service"
import { Trash2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface QuizBuilderProps {
  quizzes: Quiz[]
  onChange: (quizzes: Quiz[]) => void
}

export default function QuizBuilder({ quizzes, onChange }: QuizBuilderProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  
  // Ensure we always have exactly 3 quiz slots
  const [localQuizzes, setLocalQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    // Initialize with 3 empty quizzes or existing quizzes
    const initialized = Array(3).fill(null).map((_, index) => {
      if (quizzes[index]) {
        return quizzes[index]
      }
      return {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "A",
        explanation: "",
        order: index + 1,
      } as Quiz
    })
    setLocalQuizzes(initialized)
  }, [quizzes])

  // Update quiz
  const updateQuiz = (index: number, field: keyof Quiz, value: any) => {
    const updated = [...localQuizzes]
    updated[index] = { ...updated[index], [field]: value }
    setLocalQuizzes(updated)
    
    // Only send non-empty quizzes to parent
    const nonEmpty = updated.filter(q => q.question.trim() !== '')
    onChange(nonEmpty)
  }

  // Update quiz option
  const updateOption = (quizIndex: number, optionIndex: number, value: string) => {
    const updated = [...localQuizzes]
    const options = [...updated[quizIndex].options]
    options[optionIndex] = value
    updated[quizIndex] = { ...updated[quizIndex], options }
    setLocalQuizzes(updated)
    
    // Only send non-empty quizzes to parent
    const nonEmpty = updated.filter(q => q.question.trim() !== '')
    onChange(nonEmpty)
  }

  // Clear quiz
  const clearQuiz = (index: number) => {
    const updated = [...localQuizzes]
    updated[index] = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "A",
      explanation: "",
      order: index + 1,
    } as Quiz
    setLocalQuizzes(updated)
    
    // Only send non-empty quizzes to parent
    const nonEmpty = updated.filter(q => q.question.trim() !== '')
    onChange(nonEmpty)
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          📝 <strong>Quiz Guidelines:</strong> Create exactly 3 quizzes for this reading level. Each quiz must have a question, 4 options, correct answer, and explanation.
        </p>
      </div>

      {/* 3 Fixed Quiz Slots */}
      {localQuizzes.map((quiz, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-2 border-border rounded-lg overflow-hidden"
        >
          {/* Quiz Header */}
          <div className="flex items-center justify-between p-3 bg-muted/30 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Quiz {index + 1}</span>
              {quiz.question && (
                <span className="text-xs text-green-600 dark:text-green-400">✓ Filled</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="p-1 hover:bg-muted rounded text-sm"
                type="button"
              >
                {expandedIndex === index ? '−' : '+'}
              </button>
              {quiz.question && (
                <button
                  onClick={() => clearQuiz(index)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  title="Clear"
                  type="button"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          </div>

          {/* Quiz Content */}
          {expandedIndex === index && (
            <div className="p-4 space-y-4">
              {/* Question */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={quiz.question}
                  onChange={(e) => updateQuiz(index, 'question', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm min-h-[80px]"
                  placeholder="Enter your question..."
                />
              </div>

              {/* Options */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Options <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {quiz.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg font-semibold text-sm">
                        {String.fromCharCode(65 + optIndex)}
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, optIndex, e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      />
                      {quiz.correctAnswer === String.fromCharCode(65 + optIndex) && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Correct Answer <span className="text-red-500">*</span>
                </label>
                <select
                  value={quiz.correctAnswer}
                  onChange={(e) => updateQuiz(index, 'correctAnswer', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                >
                  {quiz.options.map((option, optIndex) => (
                    <option key={optIndex} value={String.fromCharCode(65 + optIndex)}>
                      {String.fromCharCode(65 + optIndex)} - {option || '(empty)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Explanation */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={quiz.explanation}
                  onChange={(e) => updateQuiz(index, 'explanation', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm min-h-[80px]"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
