"use client"

import Link from "next/link"
import { motion, useInView, useScroll, useTransform, type Variants } from "framer-motion"
import { useRef } from "react"
import { useRouter } from "next/navigation"

const ease = [0.22, 1, 0.36, 1] as const

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [...ease] },
  },
}

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "Home",         href: "#hero"         },
      { label: "Features",     href: "#features"     },
      { label: "Pricing",      href: "#pricing"      },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ",        href: "#faq"     },
      { label: "Contact Us", href: "#contact" },
    ],
  },
]

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" /><path d="M8 7h9v9" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4 20 20" /><path d="M20 4 13.5 11.1" /><path d="M10.5 13 4 20" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export default function CTASection() {
  const router     = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const isInView   = useInView(cardRef, { once: true, margin: "-60px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "start 10%"],
  })

  const scale   = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-background py-0 sm:py-20"
    >
      <div className="mx-auto max-w-6xl sm:px-6">
        <motion.div
          ref={cardRef}
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative overflow-hidden rounded-none border-0 sm:rounded-[34px] sm:border"
          style={{
            scale,
            opacity,
            backgroundColor: "var(--cta-bg)",
            color:           "var(--cta-fg)",
            borderColor:     "var(--cta-card-border)",
            boxShadow:       "var(--cta-shadow)",
          }}
        >
          {/* Overlay gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-75"
            style={{
              backgroundImage: [
                `radial-gradient(circle at 50% -10%, var(--cta-overlay-top), transparent 36%)`,
                `linear-gradient(140deg, var(--cta-overlay-side), transparent 42%)`,
              ].join(", "),
            }}
          />

          {/* ── CTA content ── */}
          <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <motion.div variants={fadeUp} className="mx-auto max-w-3xl">
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[4rem] lg:leading-[1.05]"
                style={{ color: "var(--cta-fg)" }}
              >
                Ready to make research{" "}
                <span style={{ color: "var(--cta-btn-primary-bg)" }}>easy?</span>
              </h2>
              <p
                className="mx-auto mt-5 max-w-xl text-base leading-8 sm:text-lg"
                style={{ color: "var(--cta-muted)" }}
              >
                Start for free — no credit card required. Get 3 articles simplified instantly, upgrade anytime.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => router.push("/workspace")}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] sm:gap-3 sm:px-6 sm:py-4 sm:text-base"
                style={{ backgroundColor: "var(--cta-btn-primary-bg)", color: "var(--cta-btn-primary-fg)" }}
              >
                Start for Free
                <ArrowUpRightIcon />
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 sm:px-6 sm:py-4 sm:text-base"
                style={{ borderColor: "var(--cta-btn-secondary-border)", color: "var(--cta-btn-secondary-fg)" }}
              >
                See How It Works
              </button>
            </motion.div>
          </div>

          {/* ── Footer strip ── */}
          <div
            className="relative px-6 py-8 sm:px-10 sm:py-10 lg:px-16"
            style={{ borderTop: "1px solid var(--cta-border)" }}
          >
            <motion.div variants={fadeUp} className="grid gap-8 md:grid-cols-[1.4fr_0.7fr_0.7fr] md:gap-10">

              {/* Brand col */}
              <div className="max-w-sm space-y-4">
                <Link href="/" className="inline-block">
                  <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--cta-fg)" }}>
                    Scory
                  </span>
                </Link>
                <p className="text-sm leading-7" style={{ color: "var(--cta-muted)" }}>
                  AI-powered research platform that turns complex scientific papers into clear, honest summaries — personalized to your reading level.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {[
                    { href: "https://x.com/scoryhq",        label: "X",         Icon: XIcon         },
                    { href: "https://instagram.com/scoryhq", label: "Instagram", Icon: InstagramIcon },
                  ].map(({ href, label, Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200"
                      style={{ borderColor: "var(--cta-border)", backgroundColor: "var(--cta-social-bg)", color: "var(--cta-social-fg)" }}
                      aria-label={label}
                    >
                      <Icon />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Link groups */}
              {footerGroups.map((group, index) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, ease: [...ease], delay: index * 0.08 }}
                >
                  <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--cta-fg)" }}>
                    {group.title}
                  </h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {group.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: "var(--cta-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cta-fg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cta-muted)")}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
              variants={fadeUp}
              className="mt-8 pt-5"
              style={{ borderTop: "1px solid var(--cta-border)" }}
            >
              <div
                className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between"
                style={{ color: "var(--cta-muted)" }}
              >
                <p>© 2026 Scory. All rights reserved.</p>
                <p>Making science accessible for everyone.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
