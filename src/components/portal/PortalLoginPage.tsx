"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import logoImage from "@/assets/logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPortalAuthService, type PortalRole } from "@/components/portal/portal-auth"

interface PortalLoginPageProps {
  role: PortalRole
  title: string
  description: string
  dashboardPath: string
}

export default function PortalLoginPage({
  role,
  title,
  description,
  dashboardPath,
}: PortalLoginPageProps) {
  const router = useRouter()
  const authService = getPortalAuthService(role)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { user } = await authService.login(formData)
      toast.success("Login successful", {
        description: `Welcome back, ${user.fullName}.`,
      })
      router.push(dashboardPath)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Please check your credentials."
      toast.error("Login failed", {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.08),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.08),_transparent_35%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 rounded-2xl border border-border/70 bg-background p-3 shadow-sm">
            <Image src={logoImage} alt="Scory" width={40} height={40} className="object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="pl-9"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="mt-2 w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
