"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, User, FileCheck, ArrowLeft } from "lucide-react"
import { reviewerAuthService } from "@/services"
import { toast } from "sonner"
import Image from "next/image"
import logoImage from "@/assets/logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

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
        const { user } = await reviewerAuthService.login({
          email: formData.email,
          password: formData.password,
        })

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
        await reviewerAuthService.register({
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mb-8"
        >
            <div className="relative w-16 h-16 mb-6 bg-gradient-to-tr from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center shadow-inner border border-white/10">
              <Image
                src={logoImage}
                alt="Scory Logo"
                width={40}
                height={40}
                className="object-contain drop-shadow-sm"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight text-center">
                {isLogin ? "Welcome back" : "Join our team"}
            </h1>
            <p className="text-muted-foreground text-sm text-center mt-2 max-w-xs">
                 {isLogin ? "Enter your credentials to access the reviewer workspace" : "Create an account to become a content reviewer"}
            </p>
        </motion.div>

        <motion.div 
            layout
            className="bg-card border border-border rounded-xl shadow-lg shadow-primary/5 p-6 md:p-8 backdrop-blur-sm bg-card/95"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-foreground ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="pl-9 bg-background/50 focus:bg-background transition-colors"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-foreground ml-1">Nickname (Optional)</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                    placeholder="Johnny"
                                    className="pl-9 bg-background/50 focus:bg-background transition-colors"
                                />
                            </div>
                        </div>
                  </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
                <label className="text-xs font-medium text-foreground ml-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                        className="pl-9 bg-background/50 focus:bg-background transition-colors"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-foreground ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="pl-9 bg-background/50 focus:bg-background transition-colors"
                        required
                        minLength={6}
                    />
                </div>
                {!isLogin && (
                    <p className="text-[10px] text-muted-foreground ml-1">Must be at least 6 characters</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 font-semibold shadow-md"
                size="lg"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isLogin ? "Signing in..." : "Creating account..."}
                    </>
                ) : (
                    <>
                        {isLogin ? (
                            <>Sign In <FileCheck className="ml-2 h-4 w-4" /></>
                        ) : (
                            "Create Account"
                        )}
                    </>
                )}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-4 text-center">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                    onClick={() => {
                        setIsLogin(!isLogin)
                        setFormData({ fullName: "", nickname: "", email: "", password: "" })
                    }}
                    className="text-primary hover:text-primary/80 font-semibold hover:underline underline-offset-4 transition-all"
                >
                    {isLogin ? "" : "Sign in"}
                </button>
            </p>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-8"
        >
            <button
                onClick={() => router.push('/')}
                className="group inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </button>
        </motion.div>
      </div>
    </div>
  )
}
