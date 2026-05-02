"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { useState } from "react"
import { Check, CheckCircle2, ChevronDown, GraduationCap, Loader2, Mail, Phone, Send, UserRound } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  earlyAccessRoleOptions,
  submitEarlyAccessSignup,
  type EarlyAccessContactType,
  type EarlyAccessRole,
} from "@/services/earlyAccess.service"

interface EarlyAccessFormProps {
  initialUseCase?: string
  className?: string
}

const contactOptions: Array<{
  value: EarlyAccessContactType
  label: string
  icon: typeof Mail
}> = [
  { value: "email", label: "Email", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: Phone },
]

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isValidWhatsApp(value: string) {
  const compact = value.trim().replace(/[\s().-]/g, "")
  const digits = compact.startsWith("+") ? compact.slice(1) : compact
  return /^\d{8,20}$/.test(digits)
}

export default function EarlyAccessForm({ initialUseCase = "", className }: EarlyAccessFormProps) {
  const [contactType, setContactType] = useState<EarlyAccessContactType>("email")
  const [fullName, setFullName] = useState("")
  const [contactValue, setContactValue] = useState("")
  const [role, setRole] = useState<EarlyAccessRole>("student")
  const [useCase, setUseCase] = useState(initialUseCase)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedFullName = fullName.trim()
    if (!trimmedFullName) {
      toast.error("Full name is required", {
        description: "Add your name so we can identify your request.",
      })
      return
    }

    const trimmedContact = contactValue.trim()
    if (!trimmedContact) {
      toast.error("Contact is required", {
        description: "Add your email or WhatsApp number so we can contact you.",
      })
      return
    }

    if (contactType === "email" && !isValidEmail(trimmedContact)) {
      toast.error("Email is not valid", {
        description: "Use an active email address.",
      })
      return
    }

    if (contactType === "whatsapp" && !isValidWhatsApp(trimmedContact)) {
      toast.error("WhatsApp number is not valid", {
        description: "Use digits with an optional country code, for example +6281234567890.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitEarlyAccessSignup({
        contactType,
        contactValue: trimmedContact,
        role,
        fullName: trimmedFullName,
        useCase: useCase.trim(),
      })

      setIsSubmitted(true)
      toast.success("You're on the update list", {
        description: "We'll contact you when the newest Scory version is ready.",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later."
      toast.error("Could not submit early access request", {
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "flex w-full max-w-md flex-col justify-center rounded-lg border border-border bg-card p-5 shadow-[0_18px_60px_rgba(7,18,10,0.10)]",
          className
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-xl font-bold">You are on the update list.</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your request has been saved. We will use your selected contact method for new version launch updates.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 h-10 rounded-full"
          onClick={() => {
            setIsSubmitted(false)
            setContactValue("")
          }}
        >
          Submit another contact
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-card p-4 shadow-[0_18px_60px_rgba(7,18,10,0.10)] sm:p-5",
        className
      )}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Send className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Join the update list</h2>
          <p className="text-xs text-muted-foreground">Leave one active contact so we can send launch updates.</p>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="full-name" className="text-sm font-medium">
              Full name
            </label>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your name"
                className="h-10 rounded-md pl-10"
                maxLength={100}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <div className="relative">
              <GraduationCap className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <SelectPrimitive.Root value={role} onValueChange={(value) => setRole(value as EarlyAccessRole)}>
                <SelectPrimitive.Trigger
                  id="role"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 pl-10 text-sm outline-none transition-[color,box-shadow] focus:border-ring focus:ring-[3px] focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                >
                  <SelectPrimitive.Value />
                  <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content className="z-50 max-h-72 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md">
                    <SelectPrimitive.Viewport className="p-1">
                      {earlyAccessRoleOptions.map((item) => (
                        <SelectPrimitive.Item
                          key={item.value}
                          value={item.value}
                          className="relative flex h-9 cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                          <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                            <SelectPrimitive.ItemIndicator>
                              <Check className="h-4 w-4" />
                            </SelectPrimitive.ItemIndicator>
                          </span>
                          <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
              </SelectPrimitive.Root>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contact method</label>
          <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-muted/40 p-1">
            {contactOptions.map((item) => {
              const Icon = item.icon
              const isActive = item.value === contactType

              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setContactType(item.value)
                    setContactValue("")
                  }}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
          <Input
            value={contactValue}
            onChange={(event) => setContactValue(event.target.value)}
            type={contactType === "email" ? "email" : "tel"}
            inputMode={contactType === "email" ? "email" : "tel"}
            placeholder={contactType === "email" ? "you@example.com" : "+6281234567890"}
            className="h-10 rounded-md"
            maxLength={120}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="use-case" className="text-sm font-medium">
            Use case <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="use-case"
            value={useCase}
            onChange={(event) => setUseCase(event.target.value)}
            placeholder="Example: summarizing papers for thesis research"
            className="min-h-16 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus:border-ring focus:ring-[3px] focus:ring-ring/50"
            maxLength={500}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="mt-4 h-10 w-full rounded-full text-sm font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting
          </>
        ) : (
          <>
            Request Early Access
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
        We only use this contact for Scory development and launch updates.
      </p>
    </form>
  )
}
