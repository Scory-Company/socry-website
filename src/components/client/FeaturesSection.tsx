"use client"

import {
  ArrowRight,
  BookOpen,
  Brain,
  FileText,
  FileUp,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Sparkles,
    title: "Start from a Title",
    description:
      "Already have a research title? Drop it in and let Scory map the topic, direction, and related article paths around it.",
    gradient: "from-primary/80 to-primary/25",
    mockup: "title",
  },
  {
    icon: Search,
    title: "Search Articles Faster",
    description:
      "Search with keywords, topic phrases, or rough ideas and move straight into relevant research without digging manually.",
    gradient: "from-neutral-800 to-neutral-500",
    mockup: "search",
  },
  {
    icon: FileUp,
    title: "Upload Article PDFs",
    description:
      "Bring your own paper into the workspace and continue from a real PDF when you already know what you want to analyze.",
    gradient: "from-sky-800/70 to-sky-500/25",
    mockup: "upload",
  },
  {
    icon: WandSparkles,
    title: "Personalize the Reading",
    description:
      "Set the complexity to match your background so explanations feel usable, whether you are exploring a topic or validating a direction.",
    gradient: "from-emerald-800/60 to-emerald-600/20",
    mockup: "level",
  },
]

function TitleMockup() {
  return (
    <div className="absolute bottom-0 left-1/2 w-[85%] -translate-x-1/2 rounded-t-2xl bg-white p-4 shadow-xl dark:bg-neutral-900">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-100">Title Mapping</p>
            <p className="text-[10px] text-neutral-400">Research scope preview</p>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-100 px-3 py-2 text-[11px] leading-relaxed text-neutral-500 dark:bg-neutral-800">
          The Impact of Artificial Intelligence on Personalized Learning in Higher Education
        </div>

        <div className="space-y-2">
          {["Topic focus", "Suggested direction", "Related article areas"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div className="h-1.5 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <span className="text-[10px] text-neutral-400">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchMockup() {
  return (
    <div className="absolute bottom-0 left-1/2 w-[85%] -translate-x-1/2 rounded-t-2xl bg-white p-4 shadow-xl dark:bg-neutral-900">
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
          <Search className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <span className="text-xs text-neutral-400">quantum computing biology...</span>
        </div>
        {[
          { title: "Quantum Biology: A New Frontier", journal: "Nature - 2024" },
          { title: "DNA Computation in Living Cells", journal: "Science - 2025" },
          { title: "Photosynthesis & Quantum Effects", journal: "Cell - 2024" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] font-semibold text-neutral-800 dark:text-neutral-100">
                {item.title}
              </div>
              <div className="text-[10px] text-neutral-400">{item.journal}</div>
            </div>
            <ArrowRight className="h-3 w-3 shrink-0 text-neutral-300" />
          </div>
        ))}
      </div>
    </div>
  )
}

function UploadMockup() {
  return (
    <div className="absolute bottom-0 left-1/2 w-[85%] -translate-x-1/2 rounded-t-2xl bg-white p-4 shadow-xl dark:bg-neutral-900">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <FileUp className="h-3 w-3 text-primary" />
          </div>
          <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-100">PDF Upload Mode</span>
        </div>

        <div className="rounded-2xl border border-dashed border-primary/35 bg-primary/5 px-4 py-5">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-neutral-800">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 text-center text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
            journal-article.pdf
          </p>
          <p className="mt-1 text-center text-[10px] text-neutral-400">Ready for the next analysis step</p>
        </div>

        <div className="space-y-2">
          {["PDF attached", "Personalization optional", "Continue inside workspace"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-xl bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
              <span className="text-[10px] text-neutral-500">{item}</span>
              <Brain className="h-3.5 w-3.5 text-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LevelMockup() {
  const levels = ["High School", "Undergraduate", "Graduate", "Researcher"]

  return (
    <div className="absolute bottom-0 left-1/2 w-[85%] -translate-x-1/2 rounded-t-2xl bg-white p-4 shadow-xl dark:bg-neutral-900">
      <div className="space-y-3">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <BookOpen className="h-3 w-3 text-primary" />
          </div>
          <span className="text-[11px] font-semibold">Reading Level</span>
        </div>

        {levels.map((level, i) => (
          <div
            key={level}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-[11px] font-medium transition-all ${
              i === 1
                ? "bg-primary text-primary-foreground"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
            }`}
          >
            <span>{level}</span>
            {i === 1 && <span className="text-[10px] opacity-80">Selected</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

const mockups: Record<string, React.ReactNode> = {
  title: <TitleMockup />,
  search: <SearchMockup />,
  upload: <UploadMockup />,
  level: <LevelMockup />,
}

export default function FeaturesSection() {
  return (
    <section className="bg-background py-20 sm:py-28" id="features">
      <div className="container mx-auto space-y-14 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built around how research
            <br />
            <span className="text-primary">actually starts.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Whether you begin with a title, a topic, a PDF, or a need for simpler explanations, the workspace gives
            you a clear starting point.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.title}
                className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`relative h-64 overflow-hidden bg-linear-to-br ${feature.gradient}`}>
                  {mockups[feature.mockup]}
                </div>

                <div className="space-y-2 p-6">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
