"use client"

import { X } from "lucide-react"

interface FilterChipProps {
  label: string
  onRemove: () => void
}

export default function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-secondary rounded-full">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-muted rounded-full transition-colors"
        aria-label="Remove filter"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  )
}
