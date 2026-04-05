"use client"

import { cn } from "@/lib/utils"

interface LabelProps {
  text: string
  className?: string
}

export function Label({ text, className }: LabelProps) {
  return (
    <div className={cn("text-xs text-dark-muted mb-[5px] mt-[14px]", className)}>
      {text}
    </div>
  )
}
