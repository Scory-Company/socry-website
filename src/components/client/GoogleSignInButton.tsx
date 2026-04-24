"use client"

import { useState } from "react"
import { googleAuthService } from "@/services/googleAuth.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface GoogleSignInButtonProps {
  onSuccess: () => void
  onError?: (error: Error) => void
}

export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      const response = await googleAuthService.signInWithGoogle()
      toast.success("Signed in with Google mock", {
        description: `Welcome, ${response.user.fullName}!`,
      })
      onSuccess()
    } catch (error: any) {
      const resolved = error instanceof Error ? error : new Error("Failed to sign in with Google mock")
      toast.error("Google Sign In Failed", {
        description: resolved.message,
      })
      onError?.(resolved)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-border rounded-lg hover:border-primary transition-colors disabled:opacity-60"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Signing in...</span>
        </>
      ) : (
        <>
          <span className="text-lg">G</span>
          <span className="text-sm font-medium">Continue with Google Mock</span>
        </>
      )}
    </button>
  )
}
