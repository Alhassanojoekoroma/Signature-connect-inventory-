"use client"

import { type Product } from "@/lib/constants"
import { StatusDot } from "@/components/ui/status-dot"
import { ChevronLeft, Download, AlertTriangle } from "lucide-react"

interface DetailProps {
  product: Product | null
  onNavigate: (page: string) => void
  onAction: (action: string) => void
}

export function Detail({ product, onNavigate, onAction }: DetailProps) {
  if (!product) return null

  const serial = product.serials?.[0] || "N/A"

  return (
    <div className="flex-1 overflow-y-auto bg-light-bg flex flex-col">
      {/* Header */}
      <div className="py-3 px-5 flex items-center bg-light-bg shrink-0">
        <button
          onClick={() => onNavigate("products")}
          className="bg-transparent border-none cursor-pointer text-2xl text-foreground p-1 leading-none"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 text-center text-base font-bold text-foreground">
          Details
        </div>
        <div className="w-7" />
      </div>

      {/* Content */}
      <div className="px-5 pb-5 flex-1">
        {/* Product Info Card */}
        <div className="bg-white rounded-[18px] p-4 mb-3 border border-light-border">
          <div className="text-xl font-extrabold text-foreground mb-3">
            {product.name}
          </div>
          <div className="flex gap-3 mb-1">
            <div className="flex-1">
              <div className="text-[11px] text-[#888] mb-[2px]">Serial Number</div>
              <div className="text-xs font-semibold text-foreground break-all">
                {serial}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#888] mb-[2px]">Category</div>
              <div className="text-xs font-semibold text-foreground">{product.cat}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#888] mb-[2px]">Status</div>
              <div className="flex items-center">
                <StatusDot status={product.status} />
                <span className="text-xs font-semibold text-foreground">
                  {product.status}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#F0F0F0] flex justify-between items-center">
            <span className="text-xs text-[#888]">Outstanding Balance</span>
            <span className="text-lg font-extrabold text-foreground">
              {product.stock} pcs
            </span>
          </div>
        </div>

        {/* Issue Button */}
        <button
          onClick={() => {
            onAction("issue")
            onNavigate("issue")
          }}
          className="w-full py-4 rounded-2xl border-none bg-accent text-black font-extrabold text-base cursor-pointer mb-[10px]"
        >
          Issue Item
        </button>

        {/* Action Buttons */}
        <div className="flex gap-[10px] mb-[14px]">
          <button
            onClick={() => {
              onAction("return")
              onNavigate("return")
            }}
            className="flex-1 py-[14px] rounded-2xl bg-transparent border-[1.5px] border-[#DEDEDE] text-foreground font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <ChevronLeft size={16} /> Return
          </button>
          <button
            onClick={() => alert("Faulty flag noted - update Sheets")}
            className="flex-1 py-[14px] rounded-2xl bg-transparent border-[1.5px] border-[#DEDEDE] text-foreground font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <AlertTriangle size={16} /> Mark Faulty
          </button>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-[18px] p-[18px] px-4 pb-[14px] border border-light-border text-center">
          <div className="text-xs text-[#888] mb-3 flex items-center justify-center gap-1">
            <Download size={12} /> Download QR Code
          </div>
          <div className="flex justify-center mb-[10px]">
            <div className="rounded-[10px] overflow-hidden border border-[#F0F0F0]">
              <svg width={147} height={147} className="block">
                <rect width="100%" height="100%" fill="white" />
                {/* QR Code Pattern Placeholder */}
                <g fill="#111">
                  <rect x="20" y="20" width="10" height="10" />
                  <rect x="35" y="20" width="10" height="10" />
                  <rect x="50" y="20" width="10" height="10" />
                  <rect x="87" y="20" width="10" height="10" />
                  <rect x="102" y="20" width="10" height="10" />
                  <rect x="117" y="20" width="10" height="10" />
                  <rect x="20" y="35" width="10" height="10" />
                  <rect x="50" y="35" width="10" height="10" />
                  <rect x="65" y="35" width="10" height="10" />
                  <rect x="87" y="35" width="10" height="10" />
                  <rect x="117" y="35" width="10" height="10" />
                  <rect x="20" y="50" width="10" height="10" />
                  <rect x="35" y="50" width="10" height="10" />
                  <rect x="50" y="50" width="10" height="10" />
                  <rect x="87" y="50" width="10" height="10" />
                  <rect x="102" y="50" width="10" height="10" />
                  <rect x="117" y="50" width="10" height="10" />
                  <rect x="65" y="65" width="17" height="17" />
                  <rect x="20" y="87" width="10" height="10" />
                  <rect x="35" y="87" width="10" height="10" />
                  <rect x="50" y="87" width="10" height="10" />
                  <rect x="87" y="87" width="10" height="10" />
                  <rect x="102" y="87" width="10" height="10" />
                  <rect x="117" y="87" width="10" height="10" />
                  <rect x="20" y="102" width="10" height="10" />
                  <rect x="50" y="102" width="10" height="10" />
                  <rect x="87" y="102" width="10" height="10" />
                  <rect x="117" y="102" width="10" height="10" />
                  <rect x="20" y="117" width="10" height="10" />
                  <rect x="35" y="117" width="10" height="10" />
                  <rect x="50" y="117" width="10" height="10" />
                  <rect x="87" y="117" width="10" height="10" />
                  <rect x="102" y="117" width="10" height="10" />
                  <rect x="117" y="117" width="10" height="10" />
                </g>
              </svg>
            </div>
          </div>
          <div className="text-[11px] text-[#999] font-mono">
            {serial}
          </div>
        </div>
      </div>
    </div>
  )
}
