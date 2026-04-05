"use client"

import { useState } from "react"
import { STAFF, CONDITIONS, type Product } from "@/lib/constants"
import { Avatar } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { SelectField } from "@/components/ui/select-field"
import { ChevronLeft, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReturnProps {
  product: Product | null
  onNavigate: (page: string) => void
  onSubmit: (type: string, data: Record<string, unknown>) => Promise<void>
  onToast: (message: string) => void
}

export function Return({ product, onNavigate, onSubmit, onToast }: ReturnProps) {
  const [retBy, setRetBy] = useState("Fred")
  const [recBy, setRecBy] = useState("Mr Isaac")
  const [cond, setCond] = useState("Good Condition")
  
  const isBad = ["Faulty", "Damaged"].includes(cond)

  const handleSubmit = async () => {
    try {
      await onSubmit("return", {
        product: product?.name,
        serial: product?.serials?.[0],
        returnedBy: retBy,
        receivedBy: recBy,
        condition: cond,
      })
      onToast("Return logged - Sheets updated!")
      setTimeout(() => onNavigate("dashboard"), 1000)
    } catch {
      onToast("Error logging return")
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-light-bg flex flex-col">
      {/* Header */}
      <div className="py-3 px-5 flex items-center bg-light-bg shrink-0">
        <button
          onClick={() => onNavigate("detail")}
          className="bg-transparent border-none cursor-pointer text-2xl text-foreground p-1 leading-none"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 text-center text-base font-bold text-foreground">
          Return Item
        </div>
        <div className="w-7" />
      </div>

      {/* Product Summary */}
      <div className="mx-5 mb-[2px] bg-white rounded-[14px] p-3 px-[14px] border border-light-border flex items-center gap-[10px] shrink-0">
        <Avatar name={product?.name || "?"} size={40} />
        <div>
          <div className="text-sm font-bold text-foreground">
            {product?.name}
          </div>
          <div className="text-[11px] text-[#888]">
            {product?.serials?.[0] || "No serial"}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-5 flex-1">
        <Label text="Returned By *" />
        <SelectField value={retBy} onChange={setRetBy} options={STAFF} />

        <Label text="Received By *" />
        <SelectField value={recBy} onChange={setRecBy} options={STAFF} />

        <Label text="Condition *" />
        <div className="flex flex-wrap gap-2 mt-1">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCond(c)}
              className={cn(
                "py-2 px-[14px] rounded-full text-xs cursor-pointer transition-colors",
                cond === c 
                  ? "border-2 border-accent bg-accent/10 text-accent-dark font-bold" 
                  : "border-[1.5px] border-[#E0E0E0] bg-white text-[#555] font-normal"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {isBad && (
          <div className="bg-[#FFF8E1] rounded-xl p-3 px-[14px] mt-3 border border-[#FFD54F]">
            <div className="text-[13px] font-bold text-[#E65100] flex items-center gap-1">
              <AlertTriangle size={14} /> Faulty / Damaged
            </div>
            <div className="text-xs text-[#BF360C] mt-[3px] leading-relaxed">
              Admin will be prompted to update the Faulty Units column in Google Sheets.
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl border-none bg-accent text-black font-extrabold text-base cursor-pointer mt-5 mb-4"
        >
          Submit - Log to Sheets
        </button>
      </div>
    </div>
  )
}
