"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Mail, Lock, User, Loader2 } from "lucide-react"
import { clientAuthService, personalizationApi } from "@/services"
import { toast } from "sonner"
import GoogleSignInButton from "./GoogleSignInButton"
import { useRouter } from "next/navigation"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess: () => void
  searchQuery?: string // Optional search query to redirect to after login
}

export default function LoginDialog({ open, onOpenChange, onLoginSuccess, searchQuery }: LoginDialogProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login
        const { user } = await clientAuthService.login({
          email: formData.email,
          password: formData.password,
        })

        toast.success("Login successful!", {
          description: `Welcome back, ${user.fullName}!`,
        })
      } else {
        // Register
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

      // Success - close dialog and trigger callback
      onLoginSuccess()
      onOpenChange(false)
      
      // Reset form
      setFormData({ fullName: "", email: "", password: "" })

      // Check if user has completed personalization
      const hasPersonalization = await personalizationApi.hasCompletedPersonalization()
      
      if (hasPersonalization) {
        // Already personalized → go to search (with query if available)
        if (searchQuery?.trim()) {
          router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        } else {
          router.push('/search')
        }
      } else {
        // Not personalized → go to personalization
        router.push('/personalization')
      }
    } catch (error: any) {
      toast.error(isLogin ? "Login failed" : "Registration failed", {
        description: error.message || "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin)
    // Reset form when switching modes
    setFormData({ fullName: "", email: "", password: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin
              ? "Login to access your personalized research summaries"
              : "Join Scory to simplify your research journey"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  required={!isLogin}
                />
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                required
                minLength={6}
              />
            </div>
            {!isLogin && (
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button type="button" className="text-primary hover:text-primary-dark-shade transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-primary-dark-shade text-primary-foreground font-semibold rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isLogin ? "Logging in..." : "Creating account..."}</span>
              </>
            ) : (
              <span>{isLogin ? "Login" : "Sign Up"}</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <GoogleSignInButton
            onSuccess={async () => {
              onLoginSuccess()
              onOpenChange(false)
              setFormData({ fullName: "", email: "", password: "" })
              
              // Check if user has completed personalization
              const hasPersonalization = await personalizationApi.hasCompletedPersonalization()
              
              if (hasPersonalization) {
                // Already personalized → go to search (with query if available)
                if (searchQuery?.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                } else {
                  router.push('/search')
                }
              } else {
                router.push('/personalization')
              }
            }}
          />

          <div className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-primary hover:text-primary-dark-shade font-semibold transition-colors"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
