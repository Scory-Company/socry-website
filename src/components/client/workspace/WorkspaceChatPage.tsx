"use client"

import { type ChangeEvent, type CSSProperties, type KeyboardEvent, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  Compass,
  FileUp,
  LoaderCircle,
  Network,
  Paperclip,
  RotateCcw,
  Search,
  SendHorizontal,
  Sparkles,
  Target,
  WandSparkles,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import WorkspaceSidebar, { type WorkspaceRecentChat } from "@/components/client/WorkspaceSidebar"
import LoginDialog from "@/components/client/LoginDialog"
import TitleAnalysisResult from "@/components/client/workspace/TitleAnalysisResult"
import { clientAuthService } from "@/services"
import { buildTitleAnalysis, type TitleAnalysisResult as TitleAnalysisData } from "@/lib/workspace/title-analysis"

type AssistantMode = "default" | "title" | "search" | "upload"

const modeContent: Record<
  AssistantMode,
  {
    badge: string
    title: string
    description: string
    placeholder: string
    helper: string
    buttonLabel: string
  }
> = {
  default: {
    badge: "Scory AI",
    title: "What would you like to research today?",
    description:
      "Enter a research title, keyword, or rough idea. If you do not know what to search yet, just describe the topic and start from there.",
    placeholder: "Ask Scory anything about a research topic...",
    helper: "Example: AI in education, CRISPR cancer therapy, or help me find a thesis topic.",
    buttonLabel: "Start Research",
  },
  title: {
    badge: "Title Mapping Mode",
    title: "You already have a research title.",
    description:
      "Paste your title here and Scory will turn it into a clearer research starting point with mapping, weak points, and next steps.",
    placeholder: "Paste your research title here...",
    helper: "Example: The Impact of Artificial Intelligence on Personalized Learning in Higher Education",
    buttonLabel: "Analyze Title",
  },
  search: {
    badge: "Article Search Mode",
    title: "Search for research articles.",
    description: "Use keywords, topic phrases, or short descriptions to find relevant papers more quickly.",
    placeholder: "Type keywords or a topic to search for articles...",
    helper: "Example: quantum computing in drug discovery",
    buttonLabel: "Find Articles",
  },
  upload: {
    badge: "PDF Upload Mode",
    title: "Upload a research article PDF.",
    description:
      "Choose a PDF first. Scory will continue the flow and check personalization before simplification starts.",
    placeholder: "Optional note about the PDF or what you want Scory to focus on...",
    helper: "Upload the PDF first. Personalization can be checked in the next step if needed.",
    buttonLabel: "Analyze PDF",
  },
}

const quickActions = [
  {
    key: "personalize",
    title: "Personalize Research",
    icon: WandSparkles,
  },
  {
    key: "title",
    title: "I Have a Title",
    icon: Sparkles,
  },
  {
    key: "upload",
    title: "Upload Article PDF",
    icon: FileUp,
  },
  {
    key: "search",
    title: "Search Article",
    icon: Search,
  },
] as const

const mappingLoadingSteps = [
  {
    label: "Topic",
    detail: "Finding the central topic",
    icon: Target,
  },
  {
    label: "Variables",
    detail: "Detecting relationships",
    icon: Network,
  },
  {
    label: "Context",
    detail: "Reading the research setting",
    icon: Compass,
  },
  {
    label: "Gap",
    detail: "Estimating weak points",
    icon: BrainCircuit,
  },
] as const

export default function WorkspaceChatPage() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") ?? ""
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasAutoRunRef = useRef(false)
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recentChatIdRef = useRef(0)
  const availableCredits = 24
  const [query, setQuery] = useState(initialPrompt)
  const [mode, setMode] = useState<AssistantMode>("default")
  const [conversationMode, setConversationMode] = useState<AssistantMode>("default")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)
  const [recentChats, setRecentChats] = useState<WorkspaceRecentChat[]>([])
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [assistantMessage, setAssistantMessage] = useState<string | null>(null)
  const [titleAnalysis, setTitleAnalysis] = useState<TitleAnalysisData | null>(null)

  const currentMode = modeContent[mode]
  const hasConversationStarted = !!submittedPrompt || isAssistantLoading || !!assistantMessage || !!titleAnalysis
  const canResetWorkspace =
    mode !== "default" ||
    conversationMode !== "default" ||
    !!selectedFile ||
    !!query.trim() ||
    hasConversationStarted
  const isSubmitDisabled = isAssistantLoading || (mode === "upload" ? !selectedFile : !query.trim())

  const clearAnalysisTimeout = () => {
    if (!analysisTimeoutRef.current) return

    clearTimeout(analysisTimeoutRef.current)
    analysisTimeoutRef.current = null
  }

  useEffect(() => {
    const prompt = searchParams.get("prompt")?.trim()
    const shouldAutoRun = searchParams.get("autorun") === "1"

    if (!shouldAutoRun || !prompt || hasAutoRunRef.current) return
    if (!clientAuthService.isAuthenticated()) return

    hasAutoRunRef.current = true

    toast.message("Workspace flow prepared", {
      description: `Article discovery is ready for: ${prompt}`,
    })
  }, [searchParams])

  useEffect(() => {
    if (!hasConversationStarted) return

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [assistantMessage, hasConversationStarted, isAssistantLoading, titleAnalysis])

  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }
    }
  }, [])

  const pushRecentChat = (item: WorkspaceRecentChat) => {
    setRecentChats((currentChats) => {
      const nextChats = [item, ...currentChats.filter((chat) => chat.label !== item.label)]
      return nextChats.slice(0, 6)
    })
  }

  const createRecentChatId = (prefix: string) => {
    recentChatIdRef.current += 1
    return `${prefix}-${recentChatIdRef.current}`
  }

  const scheduleAssistantResponse = (callback: () => void, delay = 950) => {
    clearAnalysisTimeout()

    analysisTimeoutRef.current = setTimeout(() => {
      analysisTimeoutRef.current = null
      callback()
    }, delay)
  }

  const runWorkspaceAction = () => {
    clearAnalysisTimeout()
    setAssistantMessage(null)
    setTitleAnalysis(null)

    if (mode === "upload") {
      if (!selectedFile) return

      const uploadedFileName = selectedFile.name
      const optionalNote = query.trim()
      setConversationMode("upload")
      setSubmittedPrompt(optionalNote ? `${uploadedFileName}\n\n${optionalNote}` : uploadedFileName)
      setQuery("")
      setIsAssistantLoading(true)

      pushRecentChat({
        id: createRecentChatId("upload"),
        label: `PDF Upload: ${uploadedFileName}`,
        detail: "PDF flow",
      })

      scheduleAssistantResponse(() => {
        setIsAssistantLoading(false)
        setAssistantMessage(
          `${uploadedFileName} is ready. Scory can continue into the PDF review flow once the upload step is connected.`
        )

        toast.message("PDF flow prepared", {
          description: `${uploadedFileName} is ready for the next upload step.`,
        })
      })
      return
    }

    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    setConversationMode(mode)
    setSubmittedPrompt(trimmedQuery)
    setQuery("")
    setIsAssistantLoading(true)

    if (mode === "title") {
      scheduleAssistantResponse(() => {
        const analysis = buildTitleAnalysis(trimmedQuery)
        setTitleAnalysis(analysis)
        setIsAssistantLoading(false)
        pushRecentChat({
          id: createRecentChatId("title"),
          label: analysis.historyLabel,
          detail: analysis.verdict,
        })

        toast.success("Title analysis ready", {
          description: "Scory mapped your title into a clearer research starting point.",
        })
      })
      return
    }

    scheduleAssistantResponse(() => {
      setIsAssistantLoading(false)
      setAssistantMessage(
        mode === "search"
          ? "Article search is ready. Use this query as the starting point for finding related papers."
          : "Research flow is ready. Scory can turn this into title mapping, article search, or reading support."
      )

      pushRecentChat({
        id: createRecentChatId("query"),
        label: trimmedQuery,
        detail: mode === "search" ? "Article search" : "Research flow",
      })

      toast.message("Workspace flow prepared", {
        description: `Article discovery is ready for: ${trimmedQuery}`,
      })
    })
  }

  const handleSubmit = () => {
    const canSubmit = mode === "upload" ? !!selectedFile : !!query.trim()
    if (!canSubmit) return

    if (!clientAuthService.isAuthenticated()) {
      setIsLoginDialogOpen(true)
      return
    }

    runWorkspaceAction()
  }

  const handleLoginSuccess = () => {
    setIsLoginDialogOpen(false)
    runWorkspaceAction()
  }

  const handleActionClick = (actionKey: (typeof quickActions)[number]["key"]) => {
    clearAnalysisTimeout()
    setIsAssistantLoading(false)
    setAssistantMessage(null)
    setSubmittedPrompt("")

    if (actionKey === "personalize") {
      setTitleAnalysis(null)
      toast.message("Personalization flow will be rebuilt from this workspace.")
      return
    }

    if (actionKey === "upload") {
      setTitleAnalysis(null)
      setMode("upload")
      fileInputRef.current?.click()
      return
    }

    setSelectedFile(null)
    setTitleAnalysis(null)
    setMode(actionKey === "title" ? "title" : "search")
  }

  const handleAttachPdf = () => {
    setMode("upload")
    fileInputRef.current?.click()
  }

  const handleResetWorkspace = () => {
    clearAnalysisTimeout()
    setMode("default")
    setConversationMode("default")
    setQuery("")
    setSelectedFile(null)
    setIsAssistantLoading(false)
    setSubmittedPrompt("")
    setAssistantMessage(null)
    setTitleAnalysis(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null)
    setMode("default")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      toast.error("Only PDF files are supported", {
        description: "Please choose a .pdf file to continue.",
      })
      event.target.value = ""
      return
    }

    setSelectedFile(file)
    setMode("upload")
  }

  const handleTitleActionClick = (action: string) => {
    if (action === "Start Over") {
      handleResetWorkspace()
      return
    }

    if (action === "Refine This Title") {
      toast.message("Refinement flow is the next natural step.", {
        description: "Tighten the scope, context, or outcome before you move further.",
      })
      return
    }

    if (action === "Find Related Papers") {
      setMode("search")
      toast.message("Search mode is ready for your next literature pass.", {
        description: "Use the mapped topic, variables, and context as your starting keywords.",
      })
      return
    }

    toast.message("Gap exploration will be expanded from this title map next.")
  }

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return

    event.preventDefault()
    handleSubmit()
  }

  const renderSelectedFile = () => {
    if (!selectedFile) return null

    return (
      <div className="mb-3 flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-left">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Selected PDF</p>
          <p className="mt-1 truncate text-sm font-medium text-foreground">{selectedFile.name}</p>
        </div>
        <button
          type="button"
          onClick={handleRemoveSelectedFile}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
          aria-label="Remove selected PDF"
          title="Remove selected PDF"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const renderComposer = (placement: "hero" | "sticky") => {
    const isSticky = placement === "sticky"

    return (
      <div
        className={`w-full rounded-[26px] border border-border/80 bg-background/95 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur ${
          isSticky ? "shadow-[0_-14px_50px_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-3 px-3 pt-1">
          <div className="inline-flex min-w-0 items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">{currentMode.badge}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] text-muted-foreground">
            <span>Credits</span>
            <span className="font-semibold text-foreground">{availableCredits}</span>
          </div>
        </div>

        {renderSelectedFile()}

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleAttachPdf}
            disabled={isAssistantLoading}
            className="mb-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Attach PDF"
            title="Attach PDF"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder={isAssistantLoading ? "Scory is responding..." : currentMode.placeholder}
            disabled={isAssistantLoading}
            rows={isSticky ? 1 : 3}
            className={`w-full resize-none bg-transparent px-3 py-3 text-sm leading-7 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70 sm:text-base ${
              isSticky ? "max-h-28 min-h-12" : "min-h-20"
            }`}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="mb-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={isAssistantLoading ? "Scory is responding" : currentMode.buttonLabel}
            title={isAssistantLoading ? "Scory is responding" : currentMode.buttonLabel}
          >
            {isAssistantLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </button>
        </div>

        {!isSticky && <p className="border-t border-border/60 px-3 pt-4 text-left text-xs leading-6 text-muted-foreground">{currentMode.helper}</p>}
      </div>
    )
  }

  const renderAssistantLoading = () => {
    const loadingTitle =
      conversationMode === "title"
        ? "Scory is analyzing your title..."
        : conversationMode === "upload"
          ? "Scory is preparing your PDF flow..."
          : "Scory is preparing your research flow..."

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="w-full max-w-3xl overflow-hidden rounded-[26px] border border-border/70 bg-card/70 text-left shadow-sm"
      >
        <div className="border-b border-border/60 bg-background/70 p-5">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <BrainCircuit className="h-5 w-5" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-foreground">{loadingTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">Mapping topic, variables, context, gap, and next steps.</p>
            </div>
          </div>
        </div>

        <div className="relative p-5">
          <div className="absolute left-9 right-9 top-[54px] hidden h-px bg-border sm:block" />
          <div className="grid gap-3 sm:grid-cols-4">
            {mappingLoadingSteps.map((step, index) => {
              const StepIcon = step.icon

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.16, duration: 0.35 }}
                  className="relative rounded-2xl border border-border/70 bg-background p-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ delay: index * 0.16, duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <StepIcon className="h-4 w-4" />
                  </motion.div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.detail}</p>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-5 space-y-3">
            {["Structuring research map", "Estimating title strength", "Preparing detailed recommendations"].map(
              (label, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + index * 0.14, duration: 0.28 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3"
                >
                  {index < 2 ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                  )}
                  <p className="text-sm font-medium text-foreground">{label}</p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  const renderConversation = () => (
    <section className="w-full space-y-7">
      <div className="mx-auto flex w-full max-w-4xl justify-end">
        <div className="max-w-[min(42rem,85%)] whitespace-pre-wrap rounded-[24px] rounded-br-md bg-primary px-5 py-4 text-left text-sm leading-7 text-primary-foreground shadow-sm">
          {submittedPrompt}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl gap-3 sm:gap-4">
        <div className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          {isAssistantLoading && renderAssistantLoading()}
          {!isAssistantLoading && titleAnalysis && (
            <TitleAnalysisResult
              analysis={titleAnalysis}
              onActionClick={handleTitleActionClick}
              className="mt-0 max-w-none"
            />
          )}
          {!isAssistantLoading && assistantMessage && (
            <div className="w-full max-w-3xl rounded-[26px] border border-border/70 bg-card/70 p-5 text-left text-sm leading-7 text-muted-foreground shadow-sm">
              {assistantMessage}
            </div>
          )}
        </div>
      </div>

      <div ref={messagesEndRef} />
    </section>
  )

  return (
    <SidebarProvider
      defaultOpen={false}
      style={{ "--sidebar-width": "18rem", "--sidebar-width-icon": "3.5rem" } as CSSProperties}
    >
      <WorkspaceSidebar recentChats={recentChats} />
      <SidebarInset>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.10),_transparent_32%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--background)))]">
          <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
            <div className="flex items-center px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hidden md:inline-flex" />
                <div>
                  <h1 className="text-base font-semibold text-foreground sm:text-lg">Research Assistant</h1>
                  <p className="text-xs text-muted-foreground">A simpler home for starting your next research.</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex min-h-[calc(100vh-73px)] flex-col">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              className={`mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6 lg:px-8 ${
                hasConversationStarted ? "items-stretch pb-36 pt-8" : "items-center justify-center py-10"
              }`}
            >
              <div className="w-full text-center">
                <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    {currentMode.badge}
                  </div>
                  {canResetWorkspace && (
                    <button
                      type="button"
                      onClick={handleResetWorkspace}
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Back to Scory AI
                    </button>
                  )}
                </div>

                {hasConversationStarted ? (
                  renderConversation()
                ) : (
                  <>
                    <div className="mx-auto max-w-3xl space-y-4">
                      <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        {currentMode.title}
                      </h2>
                      <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                        {currentMode.description}
                      </p>
                    </div>

                    <div className="mx-auto mt-10 w-full max-w-3xl">{renderComposer("hero")}</div>

                    <div className="mx-auto mt-6 flex w-full max-w-4xl flex-wrap items-center justify-center gap-2">
                      {quickActions.map((action) => (
                        <button
                          key={action.key}
                          type="button"
                          onClick={() => handleActionClick(action.key)}
                          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                        >
                          <action.icon className="h-4 w-4 text-primary" />
                          <span>{action.title}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {hasConversationStarted && (
              <div className="sticky bottom-0 z-30 border-t border-border/70 bg-background/90 backdrop-blur-xl">
                <div className="mx-auto w-full max-w-3xl px-4 py-3 sm:px-6 lg:px-0">{renderComposer("sticky")}</div>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onLoginSuccess={handleLoginSuccess}
        initialMode="login"
        redirectTo={null}
      />
    </SidebarProvider>
  )
}
