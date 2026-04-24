"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqData = [
  {
    question: "What is Scory?",
    answer:
      "Scory is an AI-powered research platform that turns dense scientific papers into clear, easy-to-read summaries — personalized to your reading level. Whether you're a student or a seasoned researcher, Scory helps you understand the science without the overwhelm.",
  },
  {
    question: "How does the credit system work?",
    answer:
      "Each credit lets you simplify one article. You buy credits once and use them whenever you need — no monthly fees, no expiry. The Free plan gives you 3 credits to try, the Starter plan (Rp 15.000) gives 20 credits, and the Pro plan (Rp 50.000) gives 75 credits at the best value per credit.",
  },
  {
    question: "How accurate are the summaries?",
    answer:
      "Very. Scory uses RAG (Retrieval-Augmented Generation) technology, which means every summary is grounded directly in the source paper — not generated from memory. This eliminates hallucinations and ensures you're reading facts, not fabrications.",
  },
  {
    question: "What reading levels does Scory support?",
    answer:
      "Scory personalizes summaries based on your background. During onboarding, you set your expertise level — from high school to graduate researcher — and summaries are tailored accordingly. You can update this anytime from your settings.",
  },
  {
    question: "Do my credits expire?",
    answer:
      "No. Credits never expire. Buy once, use whenever. There's no pressure to use them within a certain timeframe.",
  },
  {
    question: "Can I try Scory before buying?",
    answer:
      "Yes! The Free plan gives you 3 credits with no payment required. That's enough to simplify 3 articles and get a real feel for how Scory works before committing to a paid plan.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 sm:py-28 bg-background" id="faq">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-12">

        {/* Heading */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Frequently asked{" "}
            <span className="text-primary">questions.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Everything you need to know about Scory.{" "}
            <br className="hidden sm:block" />
            Can&apos;t find your answer? Contact our support team.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-2">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className={`rounded-2xl border transition-colors ${
                openIndex === index
                  ? "border-border bg-muted/40"
                  : "border-border bg-card hover:bg-muted/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full px-6 py-5 text-left gap-6"
              >
                <span className="font-semibold text-sm sm:text-base">
                  {item.question}
                </span>
                <div className="shrink-0 text-muted-foreground">
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-primary" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
