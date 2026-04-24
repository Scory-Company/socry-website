"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { reviewerAuthService } from "@/services"
import Image from "next/image"
import logoImage from "@/assets/logo.png"
import { motion } from "framer-motion"

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
        // Add a minimal delay for better UX (prevents instant flash)
        setTimeout(() => setIsLoading(false), 500)
      }
    }

    checkAuth()
  }, [router, isLoginPage, pathname])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.3 }}
           className="flex flex-col items-center gap-6"
        >
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-card p-4 rounded-2xl shadow-lg border border-border/50">
                    <Image
                        src={logoImage}
                        alt="Scory Loading"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
                <div className="h-1 w-24 bg-muted overflow-hidden rounded-full">
                    <motion.div 
                        className="h-full bg-primary"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </div>
                <p className="text-xs font-medium text-muted-foreground tracking-wide animate-pulse">
                    VERIFYING ACCESS...
                </p>
            </div>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
