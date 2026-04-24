"use client"

import Link from "next/link"
import { Check, Sparkles, Zap } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Free",
    price: 0,
    originalPrice: 9999,
    credits: 3,
    description: "Just want to try? No commitment needed.",
    features: [
      "3 article simplifications",
      "Basic reading level",
      "Standard summaries",
    ],
    cta: "Get Started Free",
    highlighted: false,
    icon: null,
  },
  {
    name: "Starter",
    price: 14999,
    originalPrice: 24999,
    credits: 20,
    description: "Perfect for students and casual researchers.",
    features: [
      "20 article simplifications",
      "Personalized reading level",
      "Key points & insights",
      "Priority processing",
    ],
    cta: "Get Starter",
    highlighted: true,
    icon: Sparkles,
  },
  {
    name: "Pro",
    price: 49999,
    originalPrice: 79999,
    credits: 75,
    description: "Best value for serious readers and researchers.",
    features: [
      "75 article simplifications",
      "Personalized reading level",
      "Key points & insights",
      "Priority processing",
    ],
    cta: "Get Pro",
    highlighted: false,
    icon: Zap,
  },
]

function formatPrice(price: number) {
  if (price === 0) return "Free"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-background py-20 sm:py-28">
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
            Simple, honest
            <br />
            <span className="text-primary">pricing.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
            Pay once, use anytime. No subscriptions, no surprises.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto items-stretch mt-4">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-7 ${
                  plan.highlighted
                    ? "border-primary shadow-[0_0_0_1px] shadow-primary bg-card pt-9"
                    : "border-border bg-card"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Recommended badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      <Sparkles className="w-3 h-3" />
                      Recommended
                    </span>
                  </div>
                )}

                <div className="space-y-6 flex-1">
                  {/* Plan name */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                        {plan.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(plan.originalPrice)}
                      </span>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {plan.price === 0
                          ? "100% OFF"
                          : `${Math.round((1 - plan.price / plan.originalPrice) * 100)}% OFF`}
                      </span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight">
                      {formatPrice(plan.price)}
                    </div>
                    <div className="text-xs text-muted-foreground">one-time payment</div>
                  </div>

                  {/* Credits */}
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                    plan.highlighted ? "bg-primary/10" : "bg-muted/50"
                  }`}>
                    <div className={`text-3xl font-bold ${plan.highlighted ? "text-primary" : ""}`}>
                      {plan.credits}
                    </div>
                    <div className="text-xs text-muted-foreground leading-snug">
                      credits
                      <br />
                      <span className="font-medium text-foreground">= {plan.credits} articles simplified</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={plan.highlighted ? "" : "text-muted-foreground"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                {plan.price === 0 ? (
                  <Link
                    href="/workspace"
                    className={`mt-8 flex w-full items-center justify-center rounded-2xl py-3 text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-muted hover:bg-muted/70 text-foreground"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    className={`mt-8 w-full rounded-2xl py-3 text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-muted hover:bg-muted/70 text-foreground"
                    }`}
                  >
                    {plan.cta}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Credits never expire. Buy once, use whenever you need.
        </motion.p>
      </div>
    </section>
  )
}
