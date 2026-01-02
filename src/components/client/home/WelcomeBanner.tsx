"use client"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Award, Flame } from "lucide-react"

export default function WelcomeBanner() {
  const userName = "Alex"
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening"

  const stats = [
    { label: "Articles Read", value: "47", icon: TrendingUp },
    { label: "Reading Streak", value: "7 days", icon: Flame },
    { label: "Level", value: "12", icon: Award },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="
        relative overflow-hidden rounded-2xl p-6 sm:p-8
        bg-card text-card-foreground
        border border-border
        shadow-sm
      "
    >
      {/* Soft accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />

      {/* Minimal left accent */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-primary/60" />

      <div className="relative z-10 pl-3">
        {/* Greeting */}
        <div className="flex items-center gap-3 mb-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
            <Sparkles className="h-5 w-5 text-primary" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            {greeting}, {userName}
          </h2>
        </div>

        <p className="mb-6 max-w-2xl text-muted-foreground">
          Ready to explore more scientific articles today? You're doing great.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className="
                rounded-xl p-4
                bg-secondary
                border border-border
                hover:border-primary/30
                transition-colors
              "
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
