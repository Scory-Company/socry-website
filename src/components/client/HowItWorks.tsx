"use client"

import { Settings, Upload, Sparkles, CheckCircle2 } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    id: 1,
    icon: Settings,
    title: "Personalize Reading Level",
    description: "Set your preferred reading level from beginner to expert. We'll tailor the summary complexity just for you.",
  },
  {
    id: 2,
    icon: Upload,
    title: "Search or Upload Article",
    description: "Browse our database of scientific papers or upload your own research article in PDF format.",
  },
  {
    id: 3,
    icon: Sparkles,
    title: "AI Simplifies Content",
    description: "Our RAG-powered AI analyzes and simplifies the article based on your reading level, ensuring accuracy without hallucination.",
  },
  {
    id: 4,
    icon: CheckCircle2,
    title: "Read & Understand",
    description: "Enjoy your personalized summary with key insights, clear explanations, and highlighted important points.",
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  return (
    <section ref={sectionRef} className="relative bg-background py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            How It <span className="text-primary-darker">Works</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized research summaries in just 4 simple steps
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="relative"
              >
                {/* Step Card */}
                <div className="relative h-full bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all hover:shadow-lg group">
                  {/* Content */}
                  <div className="space-y-4">
                    {/* Step Number Badge */}
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full mx-auto">
                      <span className="text-lg sm:text-xl font-bold text-primary-darker">{step.id}</span>
                    </div>

                    {/* Icon */}
                    <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl mx-auto">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-darker" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-center leading-tight">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
