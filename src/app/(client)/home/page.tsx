"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Search, Bell, TrendingUp, Clock, BookOpen, Star, 
  Sparkles, Award, Target, ChevronRight, Flame, Zap,
  BookMarked, History, BarChart3
} from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import SearchSidebar from "@/components/client/SearchSidebar"
import ProfileDropdown from "@/components/client/ProfileDropdown"
import WelcomeBanner from "@/components/client/home/WelcomeBanner"
import ForYouSection from "@/components/client/home/ForYouSection"
import ContinueReading from "@/components/client/home/ContinueReading"
import TrendingSection from "@/components/client/home/TrendingSection"
import QuickActions from "@/components/client/home/QuickActions"
import RecentActivity from "@/components/client/home/RecentActivity"
import AchievementHighlight from "@/components/client/home/AchievementHighlight"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <SidebarProvider defaultOpen={true}>
      <SearchSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
              {/* Left: Sidebar Trigger + Title */}
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-foreground">Home</h1>
                  <p className="text-xs text-muted-foreground">Welcome back to Scory!</p>
                </div>
              </div>

              {/* Right: Notifications + Profile */}
              <div className="flex items-center gap-3">
                <button className="relative flex items-center justify-center w-10 h-10 bg-card border-2 border-border hover:border-primary/50 rounded-xl transition-all hover:scale-105">
                  <Bell className="w-5 h-5 text-foreground" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    3
                  </span>
                </button>
                <ProfileDropdown />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Quick Actions */}
            <QuickActions />

            {/* Continue Reading */}
            <ContinueReading />

            {/* For You Section */}
            <ForYouSection />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Trending (2/3) */}
              <div className="lg:col-span-2">
                <TrendingSection />
              </div>

              {/* Right: Activity & Achievement (1/3) */}
              <div className="space-y-6">
                <AchievementHighlight />
                {/* <RecentActivity /> */}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
