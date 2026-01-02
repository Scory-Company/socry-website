"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react"
import { authService } from "@/services"
import { toast } from "sonner"
import Image from "next/image"
import logoImage from "@/assets/logo.png"

export default function AdminLoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Admin Login
      const { user } = await authService.login({
        email: formData.email,
        password: formData.password,
      })

      toast.success("Login successful!", {
        description: `Welcome back, ${user.fullName}!`,
      })

      // Reset form
      setFormData({ email: "", password: "" })

      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message || "Please check your credentials",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Image
                src={logoImage}
                alt="Scory Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold">Administrator Access</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
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
                  className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Sign In as Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              This is a restricted area. Only authorized administrators can access this portal.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
