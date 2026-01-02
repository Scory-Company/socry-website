"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  PenTool,
  User,
} from "lucide-react";
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
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import logoImage from "@/assets/logo.png";
import ReviewerAuthGuard from "@/components/admin/ReviewerAuthGuard";
import { reviewerAuthService } from "@/services";
import { toast } from "sonner";

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [reviewerUser, setReviewerUser] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Check if current page is login page
  const isLoginPage = pathname === '/author';

  useEffect(() => {
    // Skip profile fetch for login page
    if (isLoginPage) {
      setIsLoadingProfile(false);
      return;
    }

    // Fetch reviewer profile from API
    const fetchReviewerProfile = async () => {
      try {
        const profile = await reviewerAuthService.getProfile();
        if (profile) {
          setReviewerUser(profile);
        }
      } catch (error) {
        console.error('Failed to fetch reviewer profile:', error);
        // Fallback to localStorage if API fails
        const storedUser = reviewerAuthService.getStoredUser();
        setReviewerUser(storedUser);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchReviewerProfile();
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      await reviewerAuthService.logout();
      toast.success("Logged out successfully", {
        description: "You have been signed out from the reviewer portal",
      });
      router.push('/author');
    } catch (error) {
      toast.error("Logout failed", {
        description: "An error occurred while logging out",
      });
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      url: "/author/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Articles",
      url: "/author/articles",
      icon: FileText,
    },
    {
      title: "Drafts",
      url: "/author/drafts",
      icon: FileText,
    },
    {
      title: "Review History",
      url: "/author/review-history",
      icon: PenTool,
    },
    {
      title: "Settings",
      url: "/author/settings",
      icon: Settings,
    },
  ];

  // If it's login page, render without sidebar
  if (isLoginPage) {
    return (
      <ReviewerAuthGuard>
        {children}
      </ReviewerAuthGuard>
    );
  }

  // Otherwise, render with sidebar layout
  return (
    <ReviewerAuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex size-8 items-center justify-center">
                <Image
                  src={logoImage}
                  alt="Scory Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Reviewer Portal</span>
                <span className="text-xs text-sidebar-foreground/60">Scory Reviewer</span>
              </div>
            </div>
            
            {/* Reviewer User Info */}
            {reviewerUser && (
              <div className="px-2 py-2 mb-2 mx-2 bg-sidebar-accent rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{reviewerUser.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{reviewerUser.email}</p>
                  </div>
                </div>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-lg font-semibold">
                {menuItems.find((item) => item.url === pathname)?.title || "Reviewer Portal"}
              </h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ReviewerAuthGuard>
  );
}
