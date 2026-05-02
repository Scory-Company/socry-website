"use client"

import Link from "next/link"
import { ArrowRight, BellRing } from "lucide-react"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const storageKey = "scory-under-development-announcement-v1"
const eventKey = "scory-under-development-announcement-change"

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(eventKey, callback)

  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(eventKey, callback)
  }
}

function getSnapshot() {
  return window.localStorage.getItem(storageKey) !== "dismissed"
}

function getServerSnapshot() {
  return false
}

export default function UnderDevelopmentAnnouncement() {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const dismiss = () => {
    window.localStorage.setItem(storageKey, "dismissed")
    window.dispatchEvent(new Event(eventKey))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dismiss()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        <div className="h-1 bg-primary" />
        <div className="p-6">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
            <BellRing className="h-5 w-5" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold leading-tight">
              Scory is under development
            </DialogTitle>
            <DialogDescription className="leading-6">
              We are preparing the newest Scory experience to provide a better, more reliable research workflow. Some features may change as we continue improving the product.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 sm:justify-start">
            <Button asChild className="rounded-full">
              <Link href="/early-access" onClick={dismiss}>
                Join update list
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={dismiss}>
              Got it
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
