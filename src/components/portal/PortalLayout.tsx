"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, User } from "lucide-react"
import { toast } from "sonner"
import logoImage from "@/assets/logo.png"
import type { AuthUser } from "@/types/auth"
import { getPortalAuthService, type PortalRole } from "@/components/portal/portal-auth"
import PortalAuthGuard from "@/components/portal/PortalAuthGuard"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface PortalLayoutProps {
  children: React.ReactNode
  role: PortalRole
  loginPath: string
  dashboardPath: string
  portalName: string
  portalSubtitle: string
}

export default function PortalLayout({
  children,
  role,
  loginPath,
  dashboardPath,
  portalName,
  portalSubtitle,
}: PortalLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const authService = getPortalAuthService(role)
  const isLoginPage = pathname === loginPath
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (isLoginPage) return

    let isMounted = true

    const loadProfile = async () => {
      try {
        const profile = await authService.getProfile()
        if (isMounted) {
          setUser(profile ?? authService.getStoredUser())
        }
      } catch {
        if (isMounted) {
          setUser(authService.getStoredUser())
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [authService, isLoginPage])

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success("Logged out", {
        description: `You have been signed out from the ${portalName.toLowerCase()}.`,
      })
      router.push(loginPath)
    } catch {
      toast.error("Logout failed", {
        description: "Please try again.",
      })
    }
  }

  if (isLoginPage) {
    return <PortalAuthGuard role={role} loginPath={loginPath}>{children}</PortalAuthGuard>
  }

  return (
    <PortalAuthGuard role={role} loginPath={loginPath}>
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 px-2 py-4">
              <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-2">
                <Image src={logoImage} alt="Scory" width={28} height={28} className="object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{portalName}</p>
                <p className="text-xs text-sidebar-foreground/60">{portalSubtitle}</p>
              </div>
            </div>

            {user && (
              <div className="mx-2 mb-2 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.fullName}</p>
                    <p className="truncate text-xs text-sidebar-foreground/60">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === dashboardPath}>
                      <Link href={dashboardPath}>
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-lg font-semibold text-foreground">{portalName}</h1>
              <p className="text-xs text-muted-foreground">Dashboard shell for upcoming API-based auth flow.</p>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </PortalAuthGuard>
  )
}
