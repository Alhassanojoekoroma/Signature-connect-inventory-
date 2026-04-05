"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectFieldProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  className?: string
  dark?: boolean
}

export function SelectField({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  className,
  dark = false
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full py-3 px-[14px] rounded-xl text-sm appearance-none cursor-pointer pr-10",
          dark 
            ? "bg-dark-card border-[1.5px] border-dark-border text-white" 
            : "bg-white border-[1.5px] border-light-border-alt text-foreground",
          className
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown 
        size={16} 
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
          dark ? "text-dark-muted" : "text-foreground/50"
        )} 
      />
    </div>
  )
}
