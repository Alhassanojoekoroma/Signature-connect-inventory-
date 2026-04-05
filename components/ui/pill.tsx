"use client"

import { cn } from "@/lib/utils"

interface PillProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function Pill({ label, active = false, onClick, className }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-[7px] rounded-full border-none cursor-pointer text-[13px] whitespace-nowrap transition-colors",
        active 
          ? "bg-accent text-black font-bold" 
          : "bg-dark-card-alt text-dark-muted font-normal hover:bg-dark-border",
        className
      )}
    >
      {label}
    </button>
  )
}
