"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, User, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { clientAuthService } from "@/services"
import { toast } from "sonner"
import GoogleSignInButton from "./GoogleSignInButton"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess: () => void
  searchQuery?: string
  initialMode?: "login" | "register"
  redirectTo?: string | null
}

export default function LoginDialog({
  open,
  onOpenChange,
  onLoginSuccess,
  searchQuery,
  initialMode = "login",
  redirectTo = "/workspace",
}: LoginDialogProps) {
  void searchQuery

  const router = useRouter()
  const [isLogin, setIsLogin] = useState(initialMode === "login")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    if (!open) return
    setIsLogin(initialMode === "login")
    setFormData({ fullName: "", email: "", password: "" })
  }, [initialMode, open])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const { user } = await clientAuthService.login({
          email: formData.email,
          password: formData.password,
        })

        toast.success("Login successful!", {
          description: `Welcome back, ${user.fullName}!`,
        })
      } else {
        if (!formData.fullName.trim()) {
          toast.error("Name is required", {
            description: "Please enter your full name",
          })
          setIsLoading(false)
          return
        }

        const { user } = await clientAuthService.register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        })

        toast.success("Account created successfully!", {
          description: `Welcome to Scory, ${user.fullName}!`,
        })
      }

      onLoginSuccess()
      onOpenChange(false)
      setFormData({ fullName: "", email: "", password: "" })
      if (redirectTo) {
        router.push(redirectTo)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Please try again"
      toast.error(isLogin ? "Login failed" : "Registration failed", {
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

  const handleToggleMode = () => {
    setIsLogin((current) => !current)
    setFormData({ fullName: "", email: "", password: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin
              ? "Login to access your workspace"
              : "Join Scory to start building your research workspace"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border-2 border-border bg-background py-2.5 pr-4 pl-10 transition-colors focus:border-primary focus:outline-none"
                  required={!isLogin}
                />
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full rounded-lg border-2 border-border bg-background py-2.5 pr-4 pl-10 transition-colors focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full rounded-lg border-2 border-border bg-background py-2.5 pr-4 pl-10 transition-colors focus:border-primary focus:outline-none"
                required
                minLength={6}
              />
            </div>
            {!isLogin && (
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary-dark-shade disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{isLogin ? "Logging in..." : "Creating account..."}</span>
              </>
            ) : (
              <span>{isLogin ? "Login" : "Sign Up"}</span>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <GoogleSignInButton
            onSuccess={async () => {
              onLoginSuccess()
              onOpenChange(false)
              setFormData({ fullName: "", email: "", password: "" })
              if (redirectTo) {
                router.push(redirectTo)
              }
            }}
          />

          <div className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={handleToggleMode}
              className="font-semibold text-primary transition-colors hover:text-primary-dark-shade"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
