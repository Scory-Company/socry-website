"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Compass,
  Gauge,
  Lightbulb,
  ListChecks,
  Network,
  Route,
  SearchCheck,
  Sparkles,
  Target,
} from "lucide-react"
import {
  type TitleAnalysisMetric,
  type TitleAnalysisNode,
  type TitleAnalysisResult as TitleAnalysisResultType,
  type TitleAnalysisSectionKey,
} from "@/lib/workspace/title-analysis"
import { cn } from "@/lib/utils"

type TitleAnalysisResultProps = {
  analysis: TitleAnalysisResultType
  onActionClick?: (action: string) => void
  className?: string
}

const sectionGlow: Record<TitleAnalysisSectionKey, string> = {
  about: "ring-primary/25 border-primary/30 bg-primary/5",
  weaknesses: "ring-amber-500/25 border-amber-500/30 bg-amber-500/5",
  gaps: "ring-emerald-500/25 border-emerald-500/30 bg-emerald-500/5",
  nextSteps: "ring-sky-500/25 border-sky-500/30 bg-sky-500/5",
}

const nodePositionClass: Record<TitleAnalysisNode["id"], string> = {
  topic: "left-4 top-4",
  variables: "right-4 top-4",
  context: "left-0 top-[150px]",
  method: "right-0 top-[150px]",
  gap: "bottom-4 left-10",
  positioning: "bottom-4 right-10",
}

const nodeIcon = {
  topic: Target,
  variables: Network,
  context: Compass,
  method: Route,
  gap: Lightbulb,
  positioning: Gauge,
} satisfies Record<TitleAnalysisNode["id"], typeof Target>

function metricToneClass(tone: TitleAnalysisMetric["tone"]) {
  if (tone === "positive") return "bg-emerald-500"
  if (tone === "warning") return "bg-amber-500"
  return "bg-primary"
}

function nodeToneClass(node: TitleAnalysisNode, isActive: boolean) {
  if (isActive) {
    if (node.tone === "warning") return "border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-200"
    if (node.tone === "positive") return "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
    return "border-primary/50 bg-primary/10 text-primary"
  }

  return "border-border/70 bg-background/90 text-foreground hover:border-primary/30 hover:bg-primary/5"
}

export default function TitleAnalysisResult({ analysis, onActionClick, className }: TitleAnalysisResultProps) {
  const [activeSection, setActiveSection] = useState<TitleAnalysisSectionKey>("about")

  const verdictTone = useMemo(() => {
    if (analysis.verdict === "Good to Continue") {
      return {
        icon: CheckCircle2,
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      }
    }

    return {
      icon: CircleAlert,
      className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    }
  }, [analysis.verdict])

  const activeSectionData = analysis.sections.find((section) => section.key === activeSection)
  const VerdictIcon = verdictTone.icon

  const renderNode = (node: TitleAnalysisNode, index: number, isFloating = false) => {
    const NodeIcon = nodeIcon[node.id]
    const isActive = activeSection === node.section

    return (
      <motion.button
        key={node.id}
        type="button"
        onClick={() => setActiveSection(node.section)}
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -3 }}
        transition={{ delay: 0.12 + index * 0.06, duration: 0.32 }}
        className={cn(
          "group rounded-2xl border p-4 text-left shadow-sm transition",
          isFloating ? cn("absolute w-[220px]", nodePositionClass[node.id]) : "w-full",
          nodeToneClass(node, isActive)
        )}
      >
        <div className="flex items-center gap-2">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <NodeIcon className="h-4 w-4" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{node.label}</p>
        </div>
        <p className="mt-3 text-sm font-medium leading-6">{node.value}</p>
      </motion.button>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={cn("mt-10 w-full max-w-5xl", className)}
    >
      <div className="overflow-hidden rounded-[32px] border border-border/70 bg-background/95 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="border-b border-border/60 bg-background px-5 py-6 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Title Mapping
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${verdictTone.className}`}>
                  <VerdictIcon className="h-3.5 w-3.5" />
                  {analysis.verdict}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Mapped into research signals</p>
                <h3 className="mt-1 max-w-3xl text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {analysis.title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {analysis.summary}
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="shrink-0 rounded-[24px] border border-border/70 bg-card/60 p-4 text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Confidence</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-semibold text-foreground">{analysis.confidenceScore}</span>
                <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-3 h-2 w-44 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.confidenceScore}%` }}
                  transition={{ delay: 0.25, duration: 0.7 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </motion.div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {analysis.metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                className="rounded-2xl border border-border/70 bg-card/50 p-4 text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{metric.label}</p>
                  <p className="text-sm font-semibold text-foreground">{metric.value}%</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: 0.32 + index * 0.06, duration: 0.65 }}
                    className={cn("h-full rounded-full", metricToneClass(metric.tone))}
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{metric.helper}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 sm:px-7 xl:grid-cols-[1.18fr_0.82fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.42 }}
            className="rounded-[28px] border border-border/70 bg-card/45 p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Research Map</p>
                <p className="mt-1 text-sm font-medium text-foreground">Focus: {activeSectionData?.title}</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BrainCircuit className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-3 md:hidden">
              {analysis.nodes.map((node, index) => renderNode(node, index))}
            </div>

            <div className="relative hidden min-h-[430px] md:block">
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 720 430" aria-hidden="true">
                {[
                  "M360 215 C300 150 235 105 125 78",
                  "M360 215 C420 150 485 105 595 78",
                  "M360 215 C280 205 230 205 110 210",
                  "M360 215 C440 205 490 205 610 210",
                  "M360 215 C290 275 240 325 150 360",
                  "M360 215 C430 275 480 325 570 360",
                ].map((path, index) => (
                  <motion.path
                    key={path}
                    d={path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary/30"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 0.65 }}
                  />
                ))}
              </svg>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.22, duration: 0.38 }}
                className="absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-primary/25 bg-background p-5 text-left shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
              >
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Network className="h-5 w-5" />
                </motion.div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Central Title</p>
                <p className="mt-2 text-base font-semibold leading-7 text-foreground">{analysis.title}</p>
              </motion.div>

              {analysis.nodes.map((node, index) => renderNode(node, index, true))}
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.42 }}
              className="rounded-[28px] border border-border/70 bg-card/50 p-5 text-left"
            >
              <div className="flex items-center gap-2">
                <BookOpenCheck className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Decision Brief</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{analysis.keyTakeaway}</p>

              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Refined Title Direction</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{analysis.refinedTitleSuggestion}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.42 }}
              className="rounded-[28px] border border-border/70 bg-card/50 p-5 text-left"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Scope Breakdown</p>
              </div>
              <div className="mt-4 grid gap-3">
                {analysis.scopeSuggestions.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
                    <p className="max-w-[65%] text-right text-sm font-medium leading-6 text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.42 }}
              className="rounded-[28px] border border-border/70 bg-card/50 p-5 text-left"
            >
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Suggested Actions</p>
              </div>
              <div className="mt-4 space-y-2">
                {analysis.suggestedActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => onActionClick?.(action)}
                    className="flex w-full items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span>{action}</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="border-t border-border/60 px-5 py-6 sm:px-7">
          <div className="mb-4 flex items-center gap-2 text-left">
            <Lightbulb className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Detailed Findings</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {analysis.sections.map((section, index) => (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.06, duration: 0.35 }}
                className={cn(
                  "rounded-[24px] border bg-card/60 p-5 text-left transition",
                  activeSection === section.key ? `ring-1 ${sectionGlow[section.key]}` : "border-border/70"
                )}
              >
                <h4 className="text-base font-semibold text-foreground">{section.title}</h4>
                <div className="mt-3 space-y-3">
                  {section.points.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm leading-7 text-muted-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 border-t border-border/60 px-5 py-6 sm:px-7 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.38 }}
            className="rounded-[28px] border border-border/70 bg-card/50 p-5 text-left"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mapped Keywords</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.38 }}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="rounded-[28px] border border-border/70 bg-card/50 p-5 text-left">
              <div className="flex items-center gap-2">
                <SearchCheck className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Research Questions</p>
              </div>
              <div className="mt-4 space-y-3">
                {analysis.researchQuestions.map((question, index) => (
                  <div key={question} className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-7 text-muted-foreground">{question}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-border/70 bg-card/50 p-5 text-left">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Search Queries</p>
              </div>
              <div className="mt-4 space-y-3">
                {analysis.searchQueries.map((query) => (
                  <div key={query} className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                    <p className="text-sm font-medium leading-6 text-foreground">{query}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
