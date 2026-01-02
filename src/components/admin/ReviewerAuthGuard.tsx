"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { reviewerAuthService } from "@/services"
import { Loader2 } from "lucide-react"

interface ReviewerAuthGuardProps {
  children: React.ReactNode
}

export default function ReviewerAuthGuard({ children }: ReviewerAuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Skip auth check for login page
  const isLoginPage = pathname === '/author'

  useEffect(() => {
    // If it's login page, skip auth check
    if (isLoginPage) {
      setIsLoading(false)
      setIsAuthenticated(true) // Allow rendering
      return
    }

    const checkAuth = async () => {
      try {
        // Check if reviewer is authenticated
        const hasSession = await reviewerAuthService.checkSession()
        
        if (!hasSession) {
          // Not authenticated, redirect to reviewer login
          router.push('/author')
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/author')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, isLoginPage, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
