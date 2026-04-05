"use client"

import { cn } from "@/lib/utils"

interface AvatarProps {
  name: string
  size?: number
  bg?: string
  textColor?: string
  className?: string
}

export function Avatar({ 
  name, 
  size = 40, 
  bg = "bg-accent", 
  textColor = "text-black",
  className 
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shrink-0",
        bg,
        textColor,
        className
      )}
      style={{ 
        width: size, 
        height: size, 
        fontSize: size * 0.34 
      }}
    >
      {initials}
    </div>
  )
}
