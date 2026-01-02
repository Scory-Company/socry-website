"use client"

import { motion } from "framer-motion"
import { History, BookOpen, Star, Bookmark, Search, Clock } from "lucide-react"

export default function RecentActivity() {
  // Mock recent activities
  const activities = [
    {
      id: "1",
      type: "read",
      icon: BookOpen,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      title: "Read article",
      description: "Machine Learning in Healthcare",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "favorite",
      icon: Star,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
      title: "Favorited article",
      description: "Quantum Computing Basics",
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "bookmark",
      icon: Bookmark,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      title: "Bookmarked article",
      description: "Climate Change Solutions",
      time: "1 day ago",
    },
    {
      id: "4",
      type: "search",
      icon: Search,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
      title: "Searched for",
      description: "Artificial Intelligence",
      time: "1 day ago",
    },
    {
      id: "5",
      type: "read",
      icon: BookOpen,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      title: "Read article",
      description: "Neuroscience Breakthroughs",
      time: "2 days ago",
    },
  ]

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
      </div>

      <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${
                index !== activities.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${activity.iconBg}`}>
                <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
              </div>

              {/* Time */}
              <div className="flex-shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <button className="w-full p-3 bg-muted/50 hover:bg-muted text-center text-sm font-medium text-primary transition-colors border-t border-border">
          View All Activity
        </button>
      </div>
    </div>
  )
}
