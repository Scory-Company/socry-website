"use client"

import { Search, ShieldCheck, Sliders, ArrowRight, FileText, Brain, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Search,
    title: "Find Instantly",
    description:
      "Search across thousands of scientific papers in seconds. No more endless browsing — just type a topic and get what's relevant.",
    gradient: "from-primary/80 to-primary/30",
    mockup: "search",
  },
  {
    icon: ShieldCheck,
    title: "Understand Clearly",
    description:
      "Every summary is grounded in the actual paper — no hallucinations, no guesswork. Just accurate insights you can trust.",
    gradient: "from-neutral-700 to-neutral-400",
    mockup: "summary",
  },
  {
    icon: Sliders,
    title: "Read Your Way",
    description:
      "Tell us your background, and Scory adjusts the complexity. Whether you're a student or a researcher, it speaks your language.",
    gradient: "from-emerald-800/60 to-emerald-600/20",
    mockup: "level",
  },
]

function SearchMockup() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] bg-white dark:bg-neutral-900 rounded-t-2xl shadow-xl p-4 space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
        <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-xs text-neutral-400">quantum computing biology...</span>
      </div>
      {[
        { title: "Quantum Biology: A New Frontier", journal: "Nature · 2024" },
        { title: "DNA Computation in Living Cells", journal: "Science · 2025" },
        { title: "Photosynthesis & Quantum Effects", journal: "Cell · 2024" },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-3 px-1">
          <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-100 truncate">{item.title}</div>
            <div className="text-[10px] text-neutral-400">{item.journal}</div>
          </div>
          <ArrowRight className="w-3 h-3 text-neutral-300 shrink-0" />
        </div>
      ))}
    </div>
  )
}

function SummaryMockup() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] bg-white dark:bg-neutral-900 rounded-t-2xl shadow-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
            <Brain className="w-3 h-3 text-primary" />
          </div>
          <span className="text-[11px] font-semibold">AI Summary</span>
        </div>
        <span className="text-[10px] text-primary font-semibold px-2 py-0.5 bg-primary/10 rounded-full">Verified</span>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 bg-neutral-800/70 dark:bg-neutral-100/70 rounded-full w-full" />
        <div className="h-2 bg-neutral-800/50 dark:bg-neutral-100/50 rounded-full w-5/6" />
      </div>
      <div className="space-y-1.5 pt-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full flex-1" />
          </div>
        ))}
      </div>
      <div className="pt-1">
        <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
          <span>Accuracy</span>
          <span className="font-medium text-primary">Source-grounded</span>
        </div>
        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full w-[96%] bg-primary rounded-full" />
        </div>
      </div>
    </div>
  )
}

function LevelMockup() {
  const levels = ["High School", "Undergraduate", "Graduate", "Researcher"]
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] bg-white dark:bg-neutral-900 rounded-t-2xl shadow-xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
          <BookOpen className="w-3 h-3 text-primary" />
        </div>
        <span className="text-[11px] font-semibold">Reading Level</span>
      </div>
      {levels.map((level, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium transition-all ${
            i === 1
              ? "bg-primary text-primary-foreground"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
          }`}
        >
          <span>{level}</span>
          {i === 1 && <span className="text-[10px] opacity-80">Selected</span>}
        </div>
      ))}
    </div>
  )
}

const mockups: Record<string, React.ReactNode> = {
  search: <SearchMockup />,
  summary: <SummaryMockup />,
  level: <LevelMockup />,
}

export default function FeaturesSection() {
  return (
    <section className="bg-background py-20 sm:py-28" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

        {/* Heading */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Built for curious minds,
            <br />
            <span className="text-primary">not just academics.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Everything you need to go from a question to a clear answer — backed by real science.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="flex flex-col rounded-3xl overflow-hidden border border-border bg-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Visual area */}
                <div className={`relative h-64 bg-linear-to-br ${feature.gradient} overflow-hidden`}>
                  {mockups[feature.mockup]}
                </div>

                {/* Text area */}
                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
