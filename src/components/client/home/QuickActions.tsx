"use client"

import { motion } from "framer-motion"
import { Search, BookOpen, Star, TrendingUp, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      icon: Search,
      label: "Search Articles",
      description: "Find new research",
      color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
      iconColor: "text-blue-500",
      href: "/search",
    },
    {
      icon: BookOpen,
      label: "My Library",
      description: "Your saved articles",
      color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20",
      iconColor: "text-purple-500",
      href: "/library",
    },
    {
      icon: Star,
      label: "Favorites",
      description: "Starred content",
      color: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20",
      iconColor: "text-yellow-500",
      href: "/favorites",
    },
    {
      icon: TrendingUp,
      label: "Trending",
      description: "Popular this week",
      color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/20",
      iconColor: "text-green-500",
      href: "/search?sort=trending",
    },
  ]

  return (
    <div>
      <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(action.href)}
            className={`group relative overflow-hidden rounded-xl p-4 border-2 transition-all hover:scale-105 ${action.color}`}
          >
            <div className="flex flex-col items-start gap-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-background/50 ${action.iconColor}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground mb-1">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
            <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
