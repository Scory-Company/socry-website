import { useEffect, useState } from "react"
import { 
  Home, Search, BookOpen, Star, Bookmark, FileText, Trophy, Flame, Target, Award, 
  TrendingUp, Clock, CheckCircle2, Filter, LogOut, Hash, LayoutGrid, Stethoscope, 
  Microscope, Brain, Zap, Leaf, FlaskConical, Atom, Globe, ScrollText, Calculator, Palette,
  ChevronDown, ChevronUp, Briefcase, Scale, GraduationCap, Music, Film, Utensils, Code, Banknote
} from "lucide-react"
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
import { categoriesApi, type CategoryResponse } from "@/services/categories.service" 

interface SearchSidebarProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

// Icon mapping helper
const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes("sport") || lowerName.includes("fitness")) return Trophy
  if (lowerName.includes("machine") || lowerName.includes("ai") || lowerName.includes("intelligence") || lowerName.includes("robot")) return Brain
  if (lowerName.includes("medic") || lowerName.includes("health") || lowerName.includes("doctor")) return Stethoscope
  if (lowerName.includes("bio")) return Microscope
  if (lowerName.includes("tech") || lowerName.includes("computer") || lowerName.includes("cyber")) return Zap
  if (lowerName.includes("environment") || lowerName.includes("nature") || lowerName.includes("eco")) return Leaf
  if (lowerName.includes("chem")) return FlaskConical
  if (lowerName.includes("phy") || lowerName.includes("astronomy") || lowerName.includes("space")) return Atom
  if (lowerName.includes("geo") || lowerName.includes("earth") || lowerName.includes("map")) return Globe
  if (lowerName.includes("hist") || lowerName.includes("ancient") || lowerName.includes("past")) return ScrollText
  if (lowerName.includes("math") || lowerName.includes("algebra") || lowerName.includes("stat")) return Calculator
  if (lowerName.includes("art") || lowerName.includes("design") || lowerName.includes("culture")) return Palette
  
  // Finance specific
  if (lowerName.includes("financ") || lowerName.includes("money") || lowerName.includes("econ") || lowerName.includes("tax") || lowerName.includes("wealth")) return Banknote
  
  if (lowerName.includes("business") || lowerName.includes("market") || lowerName.includes("startup")) return Briefcase
  if (lowerName.includes("law") || lowerName.includes("legal") || lowerName.includes("politic")) return Scale
  if (lowerName.includes("edu") || lowerName.includes("teach") || lowerName.includes("learn") || lowerName.includes("school")) return GraduationCap
  if (lowerName.includes("music") || lowerName.includes("audio")) return Music
  if (lowerName.includes("film") || lowerName.includes("movie") || lowerName.includes("video")) return Film
  if (lowerName.includes("food") || lowerName.includes("nutri") || lowerName.includes("cook")) return Utensils
  if (lowerName.includes("code") || lowerName.includes("dev") || lowerName.includes("program") || lowerName.includes("software")) return Code
  
  return BookOpen
}

import Image from "next/image"
import logo from "@/assets/logo.png"

export default function SearchSidebar({ selectedCategory, onSelectCategory }: SearchSidebarProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  // Mock gamification data
  const userLevel = 12
  const userXP = 750
  const nextLevelXP = 1000
  const xpProgress = (userXP / nextLevelXP) * 100
  const readingStreak = 7
  const weeklyGoal = 10
  const weeklyProgress = 7
  const weeklyProgressPercent = (weeklyProgress / weeklyGoal) * 100

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll()
        if (response.data && response.data.success) {
          setCategories(response.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        // toast.error("Failed to load categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

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
               {/* Fixed "All Categories" Item */}
               <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => onSelectCategory("All")}
                    isActive={selectedCategory === "All"}
                    tooltip="All Categories"
                  >
                    <Filter className="size-4" />
                    <span>All Categories</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

               {/* Dynamic Categories */}
               {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 5 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton disabled>
                        <div className="size-4 rounded-full bg-muted animate-pulse" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <>
                    {categories.slice(0, isExpanded ? undefined : 3).map((category) => {
                     const Icon = getCategoryIcon(category.name)
                     const isActive = selectedCategory === category.name
                     
                     return (
                       <SidebarMenuItem key={category.id}>
                         <SidebarMenuButton 
                           onClick={() => onSelectCategory(category.name)}
                           isActive={isActive}
                           tooltip={category.name}
                         >
                           <Icon className="size-4" />
                           <span>{category.name}</span>
                         </SidebarMenuButton>
                       </SidebarMenuItem>
                     )
                   })}
 
                   {categories.length > 3 && (
                     <SidebarMenuItem>
                       <SidebarMenuButton 
                         onClick={() => setIsExpanded(!isExpanded)}
                         className="text-muted-foreground hover:text-foreground"
                       >
                         {isExpanded ? (
                           <ChevronUp className="size-4" />
                         ) : (
                           <ChevronDown className="size-4" />
                         )}
                         <span>{isExpanded ? "Show Less" : "See All"}</span>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                   )}
                  </>
                )}
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
