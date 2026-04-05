"use client"

import { useState } from "react"
import { Camera, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScanProps {
  onNavigate: (page: string) => void
  onToast: (message: string) => void
}

export function Scan({ onNavigate, onToast }: ScanProps) {
  const [serial, setSerial] = useState("")
  const [action, setAction] = useState("")

  const handleScan = () => {
    if (!serial) {
      onToast("Please enter or scan a serial number")
      return
    }
    if (!action) {
      onToast("Please select an action")
      return
    }
    
    onToast(`Scanned: ${serial}`)
    setTimeout(() => {
      if (action === "issue") {
        onNavigate("issue")
      } else if (action === "return") {
        onNavigate("return")
      }
    }, 1000)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-dark-bg flex flex-col p-4 px-5">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <div className="text-[28px] font-extrabold text-white mb-2">Scan QR Code</div>
        <div className="text-xs text-dark-muted">Point camera at QR code on item label</div>
      </div>

      {/* Scan Area */}
      <div className="w-full aspect-square bg-dark-card rounded-2xl border-2 border-dashed border-dark-border flex items-center justify-center mb-6 shrink-0">
        <div className="text-center">
          <Camera size={48} className="text-dark-muted mx-auto mb-3" />
          <div className="text-sm font-semibold text-white mb-1">Camera View</div>
          <div className="text-[11px] text-dark-muted">QR codes will appear here</div>
        </div>
      </div>

      {/* Manual Entry */}
      <label className="text-xs text-dark-muted block mb-[6px]">
        Or Enter Serial Number
      </label>
      <input
        type="text"
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
        placeholder="e.g., XPONDD87A2D2"
        className="w-full py-3 px-[14px] rounded-xl border-[1.5px] border-dark-border bg-dark-card text-white text-sm mb-5 placeholder:text-dark-muted"
      />

      {/* Action Selection */}
      <label className="text-xs text-dark-muted block mb-[6px]">
        Action
      </label>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAction("issue")}
          className={cn(
            "flex-1 py-3 px-[14px] rounded-xl text-sm cursor-pointer transition-all",
            action === "issue"
              ? "border-[1.5px] border-accent bg-accent text-black font-bold"
              : "border-[1.5px] border-dark-border bg-dark-card text-white font-medium"
          )}
        >
          Issue
        </button>
        <button
          onClick={() => setAction("return")}
          className={cn(
            "flex-1 py-3 px-[14px] rounded-xl text-sm cursor-pointer transition-all",
            action === "return"
              ? "border-[1.5px] border-accent bg-accent text-black font-bold"
              : "border-[1.5px] border-dark-border bg-dark-card text-white font-medium"
          )}
        >
          Return
        </button>
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        className="w-full py-4 rounded-xl border-none bg-accent text-black font-extrabold text-base cursor-pointer mb-4 shrink-0"
      >
        Proceed
      </button>

      {/* Back Button */}
      <button
        onClick={() => onNavigate("dashboard")}
        className="w-full py-3 rounded-xl border-[1.5px] border-dark-border bg-transparent text-white font-semibold text-sm cursor-pointer shrink-0 flex items-center justify-center gap-1"
      >
        <ChevronLeft size={16} /> Back
      </button>
    </div>
  )
}
