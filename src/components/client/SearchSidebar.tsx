"use client"

import { Home, Search, BookOpen, Star, Bookmark, FileText, Trophy, Flame, Target, Award, TrendingUp, Clock, CheckCircle2, Filter, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services"
import { toast } from "sonner"

// Categories list - Reduced to top 5
const CATEGORIES = [
  { name: "All Categories", icon: Filter },
  { name: "Sports Science", icon: Trophy },
  { name: "Machine Learning", icon: Target },
  { name: "Medical Research", icon: BookOpen },
  { name: "Biotechnology", icon: Star },
]

interface SearchSidebarProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

import Image from "next/image"
import logo from "@/assets/logo.png"

export default function SearchSidebar({ selectedCategory, onSelectCategory }: SearchSidebarProps) {
  // Mock gamification data
  const userLevel = 12
  const userXP = 750
  const nextLevelXP = 1000
  const xpProgress = (userXP / nextLevelXP) * 100
  const readingStreak = 7
  const weeklyGoal = 10
  const weeklyProgress = 7
  const weeklyProgressPercent = (weeklyProgress / weeklyGoal) * 100

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <Image
                  src={logo}
                  alt="Scory Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Scory</span>
                  <span className="text-xs text-muted-foreground">Research Made Easy</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="scrollbar-hide">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <a href="/">
                    <Home className="size-4" />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive tooltip="Search">
                  <a href="/search">
                    <Search className="size-4" />
                    <span>Search</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Library">
                  <a href="/library">
                    <BookOpen className="size-4" />
                    <span>My Library</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Favorites">
                  <a href="/favorites">
                    <Star className="size-4" />
                    <span>Favorites</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Categories - Hidden when collapsed */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CATEGORIES.map((category) => {
                const Icon = category.icon
                const isActive = selectedCategory === category.name || (selectedCategory === "All" && category.name === "All Categories")
                
                return (
                  <SidebarMenuItem key={category.name}>
                    <SidebarMenuButton 
                      onClick={() => onSelectCategory(category.name === "All Categories" ? "All" : category.name)}
                      isActive={isActive}
                      tooltip={category.name}
                    >
                      <Icon className="size-4" />
                      <span>{category.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

        {/* Collections - Only 2 most important */}
        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reading List (12)">
                  <a href="/reading-list">
                    <div className="relative">
                      <Clock className="size-4" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground group-data-[collapsible=icon]:flex">
                        12
                      </span>
                    </div>
                    <span>Reading List</span>
                    <Badge variant="secondary" className="ml-auto">12</Badge>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Bookmarked (8)">
                  <a href="/bookmarked">
                    <Bookmark className="size-4" />
                    <span>Bookmarked</span>
                    <Badge variant="secondary" className="ml-auto">8</Badge>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Progress - Simplified */}
        <SidebarGroup>
          <SidebarGroupLabel>Progress</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Collapsed State - Only 2 icons */}
            <SidebarMenu className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
              <SidebarMenuItem className="group-data-[collapsible=icon]:block hidden group-data-[collapsible=icon]:flex">
                <SidebarMenuButton tooltip={`Level ${userLevel} • ${userXP}/${nextLevelXP} XP`}>
                  <Trophy className="size-4 text-primary" />
                  <span>Level {userLevel}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="group-data-[collapsible=icon]:block hidden group-data-[collapsible=icon]:flex">
                <SidebarMenuButton tooltip={`${readingStreak} Day Streak 🔥`}>
                  <Flame className="size-4 text-orange-500" />
                  <span>{readingStreak} Days</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Expanded State - Compact */}
            <div className="space-y-3 px-2 py-2 group-data-[collapsible=icon]:hidden">
              {/* Level & XP */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="size-4 text-primary" />
                    <span className="font-semibold">Level {userLevel}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{userXP}/{nextLevelXP}</span>
                </div>
                <Progress value={xpProgress} className="h-1.5" />
              </div>

              {/* Reading Streak */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Flame className="size-4 text-orange-500" />
                  <span className="font-semibold">{readingStreak} Day Streak</span>
                </div>
                <span className="text-xs">🔥</span>
              </div>

              {/* Weekly Goal */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-primary" />
                    <span className="font-semibold">Weekly</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{weeklyProgress}/{weeklyGoal}</span>
                </div>
                <Progress value={weeklyProgressPercent} className="h-1.5" />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <a href="/achievements">
                <Award className="size-4" />
                <span>Achievements</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <button onClick={async () => {
                try {
                  await authService.logout()
                  toast.success("Logged out successfully", {
                    description: "You have been logged out",
                  })
                  setTimeout(() => {
                    window.location.href = '/'
                  }, 500)
                } catch (error) {
                  toast.error("Logout failed", {
                    description: "Please try again",
                  })
                }
              }}>
                <LogOut className="size-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
