"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  ChevronRight,
  Clock3,
  LogOut,
  Settings,
  User,
  UserPlus,
  Building2,
  Boxes,
  CircleHelp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { clientAuthService, type ClientUser as UserType } from "@/services"
import { toast } from "sonner"

export default function WorkspaceProfileMenu() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!clientAuthService.isAuthenticated()) {
          setIsLoading(false)
          return
        }

        const storedUser = clientAuthService.getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }

        const freshUser = await clientAuthService.getProfile()
        if (freshUser) {
          setUser(freshUser)
        }
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      await clientAuthService.logout()
      toast.success("Logged out successfully", {
        description: "You have been logged out",
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 500)
    } catch {
      toast.error("Logout failed", {
        description: "Please try again",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserLevel = () => 12

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
        <button className="flex w-full items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-sidebar-accent/60">
          <div className="relative">
            <Avatar className="size-9 border-2 border-primary/20">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <Badge
              variant="default"
              className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center p-0 text-[10px] font-bold"
            >
              {getUserLevel()}
            </Badge>
          </div>
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold leading-none">{user.fullName}</p>
            <p className="mt-1 text-xs text-muted-foreground">Level {getUserLevel()}</p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        className="w-80 rounded-[26px] border border-border bg-popover p-3 text-popover-foreground shadow-2xl"
      >
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-11 border border-border">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-base font-semibold">{user.fullName}</p>
              <p className="truncate text-sm text-muted-foreground">Scory Reader</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </div>

        <DropdownMenuSeparator className="my-3 bg-border" />

        <DropdownMenuItem asChild className="rounded-xl px-3 py-3 outline-none hover:bg-muted focus:bg-muted">
          <Link href="/workspace/team" className="flex cursor-pointer items-center gap-3">
            <UserPlus className="size-4 text-muted-foreground" />
            <span>Add teammates</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl px-3 py-3 outline-none hover:bg-muted focus:bg-muted">
          <Link href="/workspace/settings" className="flex cursor-pointer items-center gap-3">
            <Building2 className="size-4 text-muted-foreground" />
            <span>Workspace settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl px-3 py-3 outline-none hover:bg-muted focus:bg-muted">
          <Link href="/skills" className="flex cursor-pointer items-center gap-3">
            <Boxes className="size-4 text-muted-foreground" />
            <span>Skills</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl px-3 py-3 outline-none hover:bg-muted focus:bg-muted">
          <Link href="/workspace" className="flex cursor-pointer items-center gap-3">
            <Clock3 className="size-4 text-muted-foreground" />
            <span>Personalization</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl px-3 py-3 outline-none hover:bg-muted focus:bg-muted">
          <Link href="/profile" className="flex cursor-pointer items-center gap-3">
            <User className="size-4 text-muted-foreground" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl px-3 py-3 outline-none hover:bg-muted focus:bg-muted">
          <Link href="/settings" className="flex cursor-pointer items-center gap-3">
            <Settings className="size-4 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="rounded-xl px-3 py-3 outline-none hover:bg-muted focus:bg-muted">
          <Link href="/help" className="flex cursor-pointer items-center justify-between gap-3">
            <span className="flex items-center gap-3">
              <CircleHelp className="size-4 text-muted-foreground" />
              <span>Help</span>
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-xl px-3 py-3 outline-none hover:bg-muted focus:bg-muted"
        >
          <LogOut className="mr-2 size-4 text-muted-foreground" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
