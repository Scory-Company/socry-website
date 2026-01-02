"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, User, FileCheck } from "lucide-react"
import { reviewerAuthService } from "@/services"
import { toast } from "sonner"
import Image from "next/image"
import logoImage from "@/assets/logo.png"

export default function ReviewerAuthForm() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login
        const { user, token } = await reviewerAuthService.login({
          email: formData.email,
          password: formData.password,
        })

        console.log('[ReviewerAuth] Login successful, token saved:', !!token)
        console.log('[ReviewerAuth] Token in localStorage:', localStorage.getItem('reviewer_token') ? 'exists' : 'missing')

        toast.success("Login successful!", {
          description: `Welcome back, ${user.fullName}!`,
        })

        // Reset form
        setFormData({ fullName: "", nickname: "", email: "", password: "" })

        // Small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100))

        // Redirect to reviewer dashboard
        router.push('/author/dashboard')
      } else {
        // Register
        const { user } = await reviewerAuthService.register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          nickname: formData.nickname,
        })

        toast.success("Registration successful!", {
          description: "Please wait for admin approval before you can login.",
          duration: 5000,
        })

        // Reset form and switch to login
        setFormData({ fullName: "", nickname: "", email: "", password: "" })
        setIsLogin(true)
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-blue-100 dark:from-blue-950/20 dark:via-background dark:to-blue-900/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Image
                src={logoImage}
                alt="Scory Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reviewer Portal</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to review articles" : "Register as a reviewer"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
            <FileCheck className="w-5 h-5" />
            <span className="font-semibold">{isLogin ? "Reviewer Access" : "Become a Reviewer"}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Nickname Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nickname (Optional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="Your nickname"
                    className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="reviewer@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isLogin ? "Signing in..." : "Registering..."}</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  <span>{isLogin ? "Sign In" : "Register"}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setFormData({ fullName: "", nickname: "", email: "", password: "" })
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                {isLogin ? "Register here" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Info Note */}
          {!isLogin && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Your account will need to be approved by an administrator before you can login.
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
