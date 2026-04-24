import Link from "next/link"
import Image from "next/image"
import {
  BookMarked,
  Files,
  Flame,
  LogOut,
  MessageSquarePlus,
  MessagesSquare,
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
import { clientAuthService } from "@/services"
import { toast } from "sonner"
import logo from "@/assets/logo.png"
import WorkspaceProfileMenu from "@/components/client/WorkspaceProfileMenu"

const recentChats = [
  "Find thesis ideas about fintech",
  "Map this title about AI in education",
  "Search articles on CRISPR therapy",
]

const trendingReads = [
  "AI in Higher Education",
  "CRISPR Cancer Therapy",
  "Climate Tech Research",
]

export default function WorkspaceSidebar() {
  const handleLogout = async () => {
    try {
      await clientAuthService.logout()
      toast.success("Logged out successfully", {
        description: "You have been logged out",
      })
      window.location.href = "/"
    } catch {
      toast.error("Logout failed", {
        description: "Please try again",
      })
    }
  }

  return (
    <Sidebar collapsible="icon" variant="floating" className="overflow-hidden">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
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
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="New Chat">
                  <Link href="/home">
                    <MessageSquarePlus className="size-4" />
                    <span>New Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Library">
                  <Link href="/home">
                    <BookMarked className="size-4" />
                    <span>Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Article Collection">
                  <Link href="/home">
                    <Files className="size-4" />
                    <span>Article Collection</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Trending Reads</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {trendingReads.map((item) => (
                <SidebarMenuItem key={item}>
                  <SidebarMenuButton asChild tooltip={item}>
                    <Link href="/home">
                      <Flame className="size-4 text-primary" />
                      <span>{item}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.map((chat) => (
                <SidebarMenuItem key={chat}>
                  <SidebarMenuButton asChild tooltip={chat}>
                    <Link href="/home">
                      <MessagesSquare className="size-4 text-muted-foreground" />
                      <span>{chat}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="overflow-x-hidden">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <div className="px-2 py-1">
              <WorkspaceProfileMenu />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
