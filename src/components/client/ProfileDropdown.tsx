"use client"

import { useState, useEffect } from "react"
import { User, Settings, TrendingUp, Award, LogOut, Palette } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { authService, type User as UserType } from "@/services"
import { toast } from "sonner"

export default function ProfileDropdown() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user data from storage or fetch from API
    const loadUser = async () => {
      try {
        // Check if user is authenticated first
        if (!authService.isAuthenticated()) {
          setIsLoading(false)
          return
        }

        // First try to get stored user
        const storedUser = authService.getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }

        // Then fetch fresh data from API
        const freshUser = await authService.getProfile()
        if (freshUser) {
          setUser(freshUser)
        }
      } catch (error) {
        console.error("Failed to load user:", error)
        // Clear user state on error
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success("Logged out successfully", {
        description: "You have been logged out",
      })
      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error) {
      toast.error("Logout failed", {
        description: "Please try again",
      })
    }
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Calculate user level from XP (mock calculation)
  const getUserLevel = () => {
    // This should come from backend in the future
    return 12
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-xl p-2">
        <div className="size-9 rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-xl p-2 hover:border-primary hover:border transition-colors">
          <div className="relative">
            <Avatar className="size-9 border-2 border-primary/20">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            {/* Level Badge */}
            <Badge
              variant="default"
              className="absolute -bottom-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px] font-bold"
            >
              {getUserLevel()}
            </Badge>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold leading-none">{user.fullName}</p>
            <p className="text-xs text-muted-foreground mt-1">Level {getUserLevel()}</p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/profile" className="cursor-pointer">
            <User className="mr-2 size-4" />
            <span>View Profile</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/progress" className="cursor-pointer">
            <TrendingUp className="mr-2 size-4" />
            <span>My Progress</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/achievements" className="cursor-pointer">
            <Award className="mr-2 size-4" />
            <span>Achievements</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/settings" className="cursor-pointer">
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/settings/appearance" className="cursor-pointer">
            <Palette className="mr-2 size-4" />
            <span>Appearance</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
