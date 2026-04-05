"use client"

import { STATUS_COLORS } from "@/lib/constants"

interface StatusDotProps {
  status: string
  className?: string
}

export function StatusDot({ status, className }: StatusDotProps) {
  const color = STATUS_COLORS[status] || "#888"
  
  return (
    <span
      className={`w-[7px] h-[7px] rounded-full inline-block mr-[5px] shrink-0 ${className || ""}`}
      style={{ background: color }}
    />
  )
}
