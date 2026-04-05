"use client"

import { useState } from "react"
import { PRODUCTS, STAFF, CONDITIONS } from "@/lib/constants"
import { Label } from "@/components/ui/label"
import { SelectField } from "@/components/ui/select-field"
import { ChevronLeft, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockProps {
  onNavigate: (page: string) => void
  onSubmit: (type: string, data: Record<string, unknown>) => Promise<void>
  onToast: (message: string) => void
}

export function Stock({ onNavigate, onSubmit, onToast }: StockProps) {
  const [prodName, setProdName] = useState(PRODUCTS[0].name)
  const [qty, setQty] = useState(1)
  const [serial, setSerial] = useState("")
  const [recBy, setRecBy] = useState("Mr Isaac")
  const [cond, setCond] = useState("New in Box")

  const productNames = PRODUCTS.map((p) => p.name)

  const handleSubmit = async () => {
    if (!prodName || !qty) {
      onToast("Please fill all required fields")
      return
    }
    try {
      await onSubmit("stock", {
        product: prodName,
        quantity: qty,
        serial,
        receivedBy: recBy,
        condition: cond,
      })
      onToast("Stock added - QR codes generated!")
      setTimeout(() => onNavigate("dashboard"), 1000)
    } catch {
      onToast("Error adding stock")
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-light-bg flex flex-col">
      {/* Header */}
      <div className="py-3 px-5 flex items-center bg-light-bg shrink-0">
        <button
          onClick={() => onNavigate("dashboard")}
          className="bg-transparent border-none cursor-pointer text-2xl text-foreground p-1 leading-none"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 text-center text-base font-bold text-foreground">
          Add New Stock
        </div>
        <div className="w-7" />
      </div>

      {/* Form */}
      <div className="px-5 flex-1">
        <Label text="Product Name *" />
        <SelectField value={prodName} onChange={setProdName} options={productNames} />

        <Label text="Quantity *" />
        <div className="flex gap-[10px] items-center mt-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-11 h-11 rounded-xl border-[1.5px] border-light-border-alt bg-white text-[22px] cursor-pointer text-foreground font-bold flex items-center justify-center"
          >
            <Minus size={20} />
          </button>
          <div className="flex-1 text-center text-[26px] font-extrabold text-foreground">
            {qty}
          </div>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-11 h-11 rounded-xl border-none bg-accent text-[22px] cursor-pointer text-black font-bold flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>

        <Label text="Serial Number(s) (optional)" />
        <input
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="e.g. SN001 or SN001, SN002, SN003"
          className="w-full py-3 px-[14px] rounded-xl border-[1.5px] border-light-border-alt bg-white text-sm text-foreground placeholder:text-[#888]"
        />

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

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl border-none bg-accent text-black font-extrabold text-base cursor-pointer mt-5 mb-4"
        >
          Submit - Generate QR Codes
        </button>
      </div>
    </div>
  )
}
