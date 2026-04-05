"use client"

import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  show: boolean
  bottom?: number
  className?: string
}

export function Toast({ message, show, bottom = 80, className }: ToastProps) {
  if (!show) return null
  
  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 bg-dark-bg text-white px-[22px] py-[11px] rounded-full text-[13px] font-semibold z-50 whitespace-nowrap border border-dark-border",
        className
      )}
      style={{ bottom }}
    >
      {message}
    </div>
  )
}
