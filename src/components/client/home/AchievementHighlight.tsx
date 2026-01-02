"use client"

import { motion } from "framer-motion"
import { Award, Trophy, Star, Target, Zap } from "lucide-react"

export default function AchievementHighlight() {
  // Mock recent achievement
  const recentAchievement = {
    id: "1",
    title: "Speed Reader",
    description: "Read 10 articles in one week",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    unlockedAt: "2 days ago",
    rarity: "Rare",
  }

  // Mock progress to next achievement
  const nextAchievement = {
    title: "Knowledge Seeker",
    description: "Read 50 articles total",
    progress: 47,
    total: 50,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Achievements</h3>
      </div>

      {/* Recent Achievement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/20 rounded-xl p-4"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
              <recentAchievement.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-foreground">{recentAchievement.title}</h4>
                <span className="text-xs font-semibold text-orange-600 bg-orange-500/20 px-2 py-0.5 rounded-full">
                  {recentAchievement.rarity}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{recentAchievement.unlockedAt}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{recentAchievement.description}</p>
        </div>
      </motion.div>

      {/* Next Achievement Progress */}
      <div className="bg-card border-2 border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-foreground text-sm">Next Achievement</h4>
        </div>
        
        <p className="font-medium text-foreground mb-1">{nextAchievement.title}</p>
        <p className="text-xs text-muted-foreground mb-3">{nextAchievement.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">
              {nextAchievement.progress}/{nextAchievement.total}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(nextAchievement.progress / nextAchievement.total) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-primary-dark-shade rounded-full"
            />
          </div>
        </div>
      </div>

      {/* View All Button */}
      <button className="w-full flex items-center justify-center gap-2 bg-card hover:bg-muted border-2 border-border hover:border-primary/50 rounded-xl p-3 transition-all">
        <Trophy className="w-4 h-4 text-primary" />
        <span className="font-medium text-foreground text-sm">View All Achievements</span>
      </button>
    </div>
  )
}
