"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock3 } from "lucide-react"

import { cn } from "@/lib/utils"

const launchDate = new Date("2026-05-20T00:00:00+07:00")

interface LaunchCountdownProps {
  className?: string
  tone?: "light" | "dark"
}

function getTimeLeft() {
  const difference = Math.max(0, launchDate.getTime() - Date.now())

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function formatNumber(value: number) {
  return value.toString().padStart(2, "0")
}

export default function LaunchCountdown({ className, tone = "light" }: LaunchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  const isDark = tone === "dark"

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const units = useMemo(
    () => [
      { label: "Days", value: timeLeft.days.toString() },
      { label: "Hours", value: formatNumber(timeLeft.hours) },
      { label: "Minutes", value: formatNumber(timeLeft.minutes) },
      { label: "Seconds", value: formatNumber(timeLeft.seconds) },
    ],
    [timeLeft]
  )

  const isLaunched = Object.values(timeLeft).every((value) => value === 0)

  return (
    <div
      className={cn(
        "max-w-xl rounded-lg border p-3",
        isDark
          ? "border-white/10 bg-white/[0.06] text-white shadow-none"
          : "border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            isDark ? "bg-primary/20 text-primary-light" : "bg-primary/10 text-primary"
          )}
        >
          <Clock3 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">
            {isLaunched ? "The new version is opening now" : "New version countdown"}
          </p>
          <p className={cn("text-xs", isDark ? "text-white/60" : "text-muted-foreground")}>
            New version target: 20 May 2026
          </p>
        </div>
      </div>

      {!isLaunched && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {units.map((item) => (
            <div
              key={item.label}
              className={cn(
                "rounded-md border px-2 py-2 text-center",
                isDark ? "border-white/10 bg-white/[0.07]" : "border-border bg-background"
              )}
            >
              <div className="text-lg font-bold tabular-nums sm:text-xl">{item.value}</div>
              <div className={cn("mt-0.5 text-[0.6rem] font-medium uppercase", isDark ? "text-white/55" : "text-muted-foreground")}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
