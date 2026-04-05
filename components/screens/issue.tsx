"use client"

import { useState } from "react"
import { STAFF, CATEGORIES, type Product } from "@/lib/constants"
import { Avatar } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { SelectField } from "@/components/ui/select-field"
import { ChevronLeft, Minus, Plus } from "lucide-react"

interface IssueProps {
  product: Product | null
  onNavigate: (page: string) => void
  onSubmit: (type: string, data: Record<string, unknown>) => Promise<void>
  onToast: (message: string) => void
}

export function Issue({ product, onNavigate, onSubmit, onToast }: IssueProps) {
  const [cat, setCat] = useState("Installation")
  const [to, setTo] = useState("Fred")
  const [auth, setAuth] = useState("Mr Isaac")
  const [cust, setCust] = useState("")
  const [qty, setQty] = useState(1)

  const handleSubmit = async () => {
    try {
      await onSubmit("issue", {
        product: product?.name,
        serial: product?.serials?.[0],
        category: cat,
        qty,
        to,
        auth,
        customer: cust,
      })
      onToast("Item issued - Sheets updated!")
      setTimeout(() => onNavigate("dashboard"), 1000)
    } catch {
      onToast("Error issuing item")
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
          Issue Item
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
        <Label text="Category *" />
        <SelectField value={cat} onChange={setCat} options={CATEGORIES} />

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

        <Label text="Issued To *" />
        <SelectField value={to} onChange={setTo} options={STAFF} />

        <Label text="Authorized By *" />
        <SelectField value={auth} onChange={setAuth} options={STAFF} />

        <Label text="Customer Name (optional)" />
        <input
          value={cust}
          onChange={(e) => setCust(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full py-3 px-[14px] rounded-xl border-[1.5px] border-light-border-alt bg-white text-sm text-foreground placeholder:text-[#888]"
        />

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
