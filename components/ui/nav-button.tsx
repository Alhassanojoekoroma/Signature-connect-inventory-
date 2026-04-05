"use client"

import { cn } from "@/lib/utils"
import { Home, Scan, Package, User } from "lucide-react"

interface NavButtonProps {
  icon: "home" | "scan" | "products" | "profile"
  label: string
  active?: boolean
  light?: boolean
  onClick?: () => void
}

const iconMap = {
  home: Home,
  scan: Scan,
  products: Package,
  profile: User,
}

export function NavButton({ icon, label, active = false, light = false, onClick }: NavButtonProps) {
  const Icon = iconMap[icon]
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 bg-transparent border-none cursor-pointer flex flex-col items-center gap-[3px] py-2 transition-colors",
        active 
          ? "text-accent" 
          : light 
            ? "text-[#AAAAAA]" 
            : "text-dark-muted"
      )}
    >
      <Icon size={20} />
      <span className={cn("text-[10px]", active && "font-bold")}>{label}</span>
    </button>
  )
}
