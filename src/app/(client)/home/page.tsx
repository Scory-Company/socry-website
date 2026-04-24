"use client"

import { type CSSProperties, useRef, useState } from "react"
import { ArrowUpRight, FileUp, Search, Sparkles, WandSparkles } from "lucide-react"
import { toast } from "sonner"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import WorkspaceSidebar from "@/components/client/WorkspaceSidebar"

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
    buttonLabel: "Continue",
  },
  title: {
    badge: "Title Mapping Mode",
    title: "You already have a research title.",
    description:
      "Paste your title here and Scory will help map the topic, direction, and related articles around it.",
    placeholder: "Paste your research title here...",
    helper: "Example: The Impact of Artificial Intelligence on Personalized Learning in Higher Education",
    buttonLabel: "Map Title",
  },
  search: {
    badge: "Article Search Mode",
    title: "Search for research articles.",
    description: "Use keywords, topic phrases, or short descriptions to find relevant papers more quickly.",
    placeholder: "Type keywords or a topic to search for articles...",
    helper: "Example: quantum computing in drug discovery",
    buttonLabel: "Search Articles",
  },
  upload: {
    badge: "PDF Upload Mode",
    title: "Upload a research article PDF.",
    description:
      "Choose a PDF first. Scory will continue the flow and check personalization before simplification starts.",
    placeholder: "Optional note about the PDF or what you want Scory to focus on...",
    helper: "Upload the PDF first. Personalization can be checked in the next step if needed.",
    buttonLabel: "Continue Upload Flow",
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

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const availableCredits = 24
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<AssistantMode>("default")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const currentMode = modeContent[mode]

  const handleContinue = () => {
    if (mode === "upload") {
      if (!selectedFile) return
      toast.message("PDF flow prepared", {
        description: `${selectedFile.name} is ready for the next upload step.`,
      })
      return
    }

    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    toast.message("Workspace flow prepared", {
      description:
        mode === "title"
          ? `Title mapping is ready for: ${trimmedQuery}`
          : `Article discovery is ready for: ${trimmedQuery}`,
    })
  }

  const handleActionClick = (actionKey: (typeof quickActions)[number]["key"]) => {
    if (actionKey === "personalize") {
      toast.message("Personalization flow will be rebuilt from this workspace.")
      return
    }

    if (actionKey === "upload") {
      setMode("upload")
      fileInputRef.current?.click()
      return
    }

    setSelectedFile(null)
    setMode(actionKey === "title" ? "title" : "search")
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setMode("upload")
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      style={{ "--sidebar-width": "18rem", "--sidebar-width-icon": "3.5rem" } as CSSProperties}
    >
      <WorkspaceSidebar />
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

          <main className="flex min-h-[calc(100vh-73px)] items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
              <div className="w-full text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {currentMode.badge}
                </div>

                <div className="mx-auto max-w-3xl space-y-4">
                  <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {currentMode.title}
                  </h2>
                  <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {currentMode.description}
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="mx-auto mt-10 w-full max-w-3xl">
                  <div className="rounded-[26px] border border-border/80 bg-background/90 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur">
                    <div className="mb-3 flex items-center justify-between px-3 pt-1">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <span>Credits</span>
                        <span className="font-semibold text-foreground">{availableCredits}</span>
                      </div>
                    </div>

                    {mode === "upload" && selectedFile && (
                      <div className="mb-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-left">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Selected PDF
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">{selectedFile.name}</p>
                      </div>
                    )}

                    <textarea
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={currentMode.placeholder}
                      className="min-h-20 w-full resize-none bg-transparent px-3 py-3 text-sm leading-7 text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
                    />

                    <div className="flex flex-col gap-3 border-t border-border/60 px-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-2xl text-left text-xs leading-6 text-muted-foreground sm:text-sm">
                        {currentMode.helper}
                      </p>
                      <button
                        type="button"
                        onClick={handleContinue}
                        disabled={mode === "upload" ? !selectedFile : !query.trim()}
                        className="inline-flex shrink-0 items-center justify-center gap-2 self-end rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                      >
                        {currentMode.buttonLabel}
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

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
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
