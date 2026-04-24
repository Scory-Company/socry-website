"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import logoImage from "@/assets/logo.png"
import { getPortalAuthService, type PortalRole } from "@/components/portal/portal-auth"

interface PortalAuthGuardProps {
  children: React.ReactNode
  role: PortalRole
  loginPath: string
}

export default function PortalAuthGuard({ children, role, loginPath }: PortalAuthGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const authService = getPortalAuthService(role)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (pathname === loginPath) {
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }

    let isMounted = true

    const verifySession = async () => {
      try {
        const hasSession = await authService.checkSession()
        if (!hasSession) {
          router.push(loginPath)
          return
        }

        if (isMounted) {
          setIsAuthenticated(true)
        }
      } catch {
        router.push(loginPath)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    verifySession()

    return () => {
      isMounted = false
    }
  }, [authService, loginPath, pathname, router])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
            <Image src={logoImage} alt="Scory" width={40} height={40} className="object-contain" />
          </div>
          <p className="text-sm text-muted-foreground">Checking session...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
