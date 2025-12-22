"use client"

import { useEffect, useRef, useState } from "react"
import { googleAuthService } from "@/services/googleAuth.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface GoogleSignInButtonProps {
  onSuccess: () => void
  onError?: (error: Error) => void
}

export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGoogleButton = async () => {
      try {
        // Load Google script
        await googleAuthService.loadGoogleScript()

        // Wait a bit for script to fully initialize
        await new Promise(resolve => setTimeout(resolve, 100))

        // Render button
        if (buttonRef.current) {
          googleAuthService.renderGoogleButton(
            'google-signin-button',
            (response) => {
              toast.success("Signed in with Google!", {
                description: `Welcome, ${response.user.fullName}!`,
              })
              onSuccess()
            },
            (err) => {
              const errorMsg = err.message || "Failed to sign in with Google"
              toast.error("Google Sign In Failed", {
                description: errorMsg,
              })
              setError(errorMsg)
              onError?.(err)
            }
          )
        }

        setIsLoading(false)
      } catch (err: any) {
        console.error('Failed to load Google Sign In:', err)
        setError(err.message || 'Failed to load Google Sign In')
        setIsLoading(false)
      }
    }

    loadGoogleButton()
  }, [onSuccess, onError])

  if (error) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Unable to load Google Sign In
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="flex items-center justify-center py-3 px-4 border-2 border-border rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading Google Sign In...</span>
        </div>
      )}
      <div
        id="google-signin-button"
        ref={buttonRef}
        className={isLoading ? 'opacity-0 absolute' : 'opacity-100'}
      />
    </div>
  )
}
