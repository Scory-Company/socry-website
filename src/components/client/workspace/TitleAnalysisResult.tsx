"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, CircleAlert, Compass, Sparkles } from "lucide-react"
import { type TitleAnalysisResult as TitleAnalysisResultType, type TitleAnalysisSectionKey } from "@/lib/workspace/title-analysis"

type TitleAnalysisResultProps = {
  analysis: TitleAnalysisResultType
  onActionClick?: (action: string) => void
}

const sectionGlow: Record<TitleAnalysisSectionKey, string> = {
  about: "ring-primary/20 border-primary/20",
  weaknesses: "ring-amber-500/20 border-amber-500/20",
  gaps: "ring-emerald-500/20 border-emerald-500/20",
  nextSteps: "ring-sky-500/20 border-sky-500/20",
}

export default function TitleAnalysisResult({ analysis, onActionClick }: TitleAnalysisResultProps) {
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

  const highlightedSection = analysis.sections.find((section) => section.key === activeSection)?.title
  const VerdictIcon = verdictTone.icon

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mt-10 w-full max-w-5xl"
    >
      <div className="overflow-hidden rounded-[32px] border border-border/70 bg-background/95 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="border-b border-border/60 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_36%)] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Title Analysis
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Analyzed just now</p>
                <h3 className="mt-1 max-w-3xl text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {analysis.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {analysis.summary}
                </p>
              </div>
            </div>

            <div className={`inline-flex items-start gap-3 rounded-2xl border px-4 py-3 text-left ${verdictTone.className}`}>
              <VerdictIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em]">Verdict</p>
                <p className="mt-1 text-sm font-semibold">{analysis.verdict}</p>
                <p className="mt-1 max-w-xs text-sm/6">{analysis.verdictReason}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="rounded-[28px] border border-border/70 bg-card/60 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Research Map</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Click a node to focus the most relevant section below.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs text-muted-foreground">
                <Compass className="h-3.5 w-3.5 text-primary" />
                Focus: {highlightedSection}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {analysis.nodes.slice(0, 3).map((node, index) => (
                <motion.button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveSection(node.section)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    activeSection === node.section
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-border/70 bg-background hover:border-primary/25 hover:bg-primary/5"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{node.label}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-foreground">{node.value}</p>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28, duration: 0.4 }}
              className="my-4 rounded-[28px] border border-primary/20 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_65%),hsl(var(--background))] p-5 text-left"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Central Title</p>
              <p className="mt-2 text-lg font-semibold leading-7 text-foreground">{analysis.title}</p>
            </motion.div>

            <div className="grid gap-3 md:grid-cols-3">
              {analysis.nodes.slice(3).map((node, index) => (
                <motion.button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveSection(node.section)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 + index * 0.08, duration: 0.35 }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    activeSection === node.section
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-border/70 bg-background hover:border-primary/25 hover:bg-primary/5"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{node.label}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-foreground">{node.value}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.45 }}
            className="rounded-[28px] border border-border/70 bg-card/50 p-5 text-left"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Suggested Actions</p>
            <div className="mt-4 space-y-2">
              {analysis.suggestedActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => onActionClick?.(action)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <span>{action}</span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid gap-4 border-t border-border/60 px-5 py-6 sm:px-7 lg:grid-cols-2">
          {analysis.sections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + index * 0.08, duration: 0.35 }}
              className={`rounded-[24px] border bg-card/60 p-5 text-left transition ${
                activeSection === section.key
                  ? `ring-1 ${sectionGlow[section.key]} shadow-sm`
                  : "border-border/70"
              }`}
            >
              <h4 className="text-base font-semibold text-foreground">{section.title}</h4>
              <div className="mt-3 space-y-3">
                {section.points.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <p className="text-sm leading-7 text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
