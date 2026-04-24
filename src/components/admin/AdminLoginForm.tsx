"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, ShieldCheck, ArrowLeft } from "lucide-react"
import { authService } from "@/services"
import { toast } from "sonner"
import Image from "next/image"
import logoImage from "@/assets/logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-3xl opacity-50" />
        </div>

      <div className="w-full max-w-[400px] relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mb-8"
        >
            <div className="relative w-16 h-16 mb-6 bg-gradient-to-tr from-primary/10 to-purple-500/10 rounded-2xl flex items-center justify-center shadow-inner border border-white/10">
              <Image
                src={logoImage}
                alt="Scory Logo"
                width={40}
                height={40}
                className="object-contain drop-shadow-sm"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight text-center">
                Admin Portal
            </h1>
            <p className="text-muted-foreground text-sm text-center mt-2">
                Secure access for system administrators
            </p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-card border border-border rounded-xl shadow-lg shadow-primary/5 p-6 md:p-8 backdrop-blur-sm bg-card/95"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
                <label className="text-xs font-medium text-foreground ml-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="admin@example.com"
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
                        Signing in...
                    </>
                ) : (
                    <>
                        Sign In <ShieldCheck className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-border">
             <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>
                  This is a restricted area. Unauthorized access is prohibited and will be logged.
                </p>
             </div>
          </div>
        </motion.div>

        {/* Back to Home */}
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
