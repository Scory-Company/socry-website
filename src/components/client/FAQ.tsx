"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, HelpCircle } from "lucide-react"

const faqData = [
  {
    question: "What is Scory?",
    answer: "Scory is an intelligent research assistant that helps you find, understand, and organize scientific literature. We use advanced AI (RAG technology) to simplify complex papers into easy-to-read summaries personalized to your knowledge level."
  },
  {
    question: "Is Scory free to use?",
    answer: "Yes, Scory offers a free tier that gives you access to our core search and summarization features. We also offer premium plans for power users who need advanced analytics, unlimited detailed summaries, and team collaboration features."
  },
  {
    question: "How accurate are the AI summaries?",
    answer: "We prioritize accuracy above all else. Unlike standard chatbots that can 'hallucinate', Scory uses Retrieval-Augmented Generation (RAG) to ground every summary in the actual text of the research paper. We also provide citations and direct links to the source material so you can verify everything."
  },
  {
    question: "Can I upload my own PDF files?",
    answer: "Absolutely! You can upload your own research papers (PDFs) to your personal library. Scory will analyze them and generate summaries, key insights, and help you chat with the document to ask specific questions."
  },
  {
    question: "Do you offer API access for developers?",
    answer: "Yes, we have a robust API for developers and institutions looking to integrate our research intelligence into their own platforms. Please contact our partnerships team for documentation and access keys."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 sm:py-24 bg-background font-sans relative overflow-hidden" id="faq">
      {/* Background decoration */}
      <div className="absolute -left-20 top-40 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-20 bottom-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Header Section */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <HelpCircle className="w-5 h-5" />
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Everything you need to know about Scory. Can't find the answer you're looking for? Feel free to contact our support team.
              </p>
            </motion.div>
          </div>

          {/* Accordion Section */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-border rounded-2xl bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex items-center justify-between w-full p-5 sm:p-6 text-left transition-colors hover:bg-muted/30"
                  >
                    <span className="font-semibold text-base sm:text-lg pr-8">
                      {item.question}
                    </span>
                    <div className={`shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 text-primary" />
                      ) : (
                        <Plus className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 sm:px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
