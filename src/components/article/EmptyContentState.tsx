"use client"

import { useState } from "react"
import { Upload, Loader2, FileText, Sparkles, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { simplificationService } from "@/services"

interface EmptyContentStateProps {
  readingLevel: string
  onGenerate: (pdfUrl: string) => Promise<void>
  title?: string
  description?: string
}

export default function EmptyContentState({ readingLevel, onGenerate, title, description }: EmptyContentStateProps) {
  // Default to 'existing' (Direct Generate) always, as requested
  const [pdfSource, setPdfSource] = useState<'file' | 'existing'>('existing')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError("Please select a PDF file")
        return
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError("File size must be less than 50MB")
        return
      }
      setPdfFile(file)
      setError("")
    }
  }

  const handleGenerate = async () => {
    setError("")
    
    if (pdfSource === 'file' && !pdfFile) {
      setError("Please select a PDF file")
      return
    }

    setIsGenerating(true)
    
    try {
      let finalUrl = "" // Empty string means use existing PDF from backend
      
      // Upload file if selected
      if (pdfSource === 'file' && pdfFile) {
        finalUrl = await simplificationService.uploadPdf(pdfFile)
      }
      
      await onGenerate(finalUrl)
    } catch (err: any) {
      setError(err.message || "Failed to generate content")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[500px]"
    >
      <div className="max-w-2xl w-full bg-card border-2 border-dashed border-border rounded-xl p-8">
        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {title || `No Content for ${readingLevel} Level`}
          </h3>
          <p className="text-muted-foreground">
            {description || "This reading level hasn't been generated yet. Use the existing PDF to automatically create simplified content."}
          </p>
        </div>

        {/* Source Selector */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setPdfSource('existing')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                pdfSource === 'existing'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RefreshCw className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Use Current PDF</span>
            </button>
            
            <button
              onClick={() => setPdfSource('file')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                pdfSource === 'file'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Upload className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Upload New PDF</span>
            </button>
          </div>

          {/* Reuse Existing UI */}
          {pdfSource === 'existing' && (
            <div className="text-center p-6 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground mb-1">
                Ready to re-process using the existing PDF
              </p>
              <p className="text-xs text-muted-foreground">
                AI will try to generate better content with the new parameters.
              </p>
            </div>
          )}

          {/* File Upload UI */}
          {pdfSource === 'file' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload PDF File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="flex items-center justify-center w-full px-4 py-8 bg-background border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-all"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      {pdfFile ? pdfFile.name : 'Click to upload PDF'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max file size: 50MB
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Content with AI
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>ℹ️ Note:</strong> AI will automatically extract text from the PDF, simplify it to the {readingLevel} level, and generate 3 quiz questions. This process may take 10-30 seconds.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
