"use client"

import { useState } from "react"
import { PRODUCTS, TRANSACTIONS } from "@/lib/constants"
import { Avatar } from "@/components/ui/avatar"
import { StatusDot } from "@/components/ui/status-dot"
import { Pill } from "@/components/ui/pill"
import { Plus } from "lucide-react"

interface DashboardProps {
  onNavigate: (page: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [filter, setFilter] = useState("All")

  const inStock = PRODUCTS.filter((p) => p.status === "In Stock").length
  const lowStock = PRODUCTS.filter((p) => p.status === "Low Stock").length
  const outStock = PRODUCTS.filter((p) => p.status === "Out of Stock").length
  const totalItems = PRODUCTS.reduce((a, p) => a + p.stock, 0)

  const filteredTransactions = filter === "All" 
    ? TRANSACTIONS 
    : TRANSACTIONS.filter((tx) => tx.status === filter)

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-5 pt-[14px] shrink-0">
        <div className="flex items-center justify-between mb-[18px]">
          <div className="flex items-center gap-[10px]">
            <Avatar name="Mr Isaac" size={40} />
            <div>
              <div className="text-[11px] text-dark-muted">Store Manager</div>
              <div className="text-[15px] font-bold text-white">Mr Isaac</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate("stock")}
            className="w-9 h-9 rounded-full bg-accent border-none cursor-pointer text-[22px] flex items-center justify-center text-black font-bold"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Stock Overview Card */}
        <div
          className="rounded-[22px] p-5 mb-[14px] overflow-hidden border border-dark-border"
          style={{
            background: "repeating-linear-gradient(135deg,#1C1C1C 0px,#1C1C1C 14px,#212121 14px,#212121 28px)"
          }}
        >
          <div className="text-[11px] text-dark-muted mb-[6px] tracking-wider uppercase">
            Stock Overview
          </div>
          <div className="flex justify-between items-end mb-[18px]">
            <div>
              <div className="text-[11px] text-dark-muted">Total Products</div>
              <div className="text-[38px] font-extrabold text-white leading-none">
                {PRODUCTS.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-dark-muted">In Stock</div>
              <div className="text-[38px] font-extrabold text-accent leading-none">
                {inStock}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { label: "Low", count: lowStock, color: "#FF9F0A", bg: "rgba(255,159,10,0.15)" },
              { label: "Empty", count: outStock, color: "#FF3B30", bg: "rgba(255,59,48,0.14)" },
              { label: "Items", count: totalItems, color: "#AAEF35", bg: "rgba(170,239,53,0.12)" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex-1 rounded-xl p-2 px-[10px]"
                style={{ background: s.bg }}
              >
                <div className="text-[10px] font-semibold" style={{ color: s.color }}>
                  {s.label}
                </div>
                <div className="text-[20px] font-extrabold" style={{ color: s.color }}>
                  {s.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-[14px] overflow-x-auto pb-[2px]">
          {["All", "In Field", "Returned", "Received"].map((f) => (
            <Pill
              key={f}
              label={f}
              active={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="px-5 pb-4 flex-1">
        <div className="text-[11px] text-dark-muted font-bold tracking-wider uppercase mb-[10px]">
          Recent Activity
        </div>
        {filteredTransactions.map((tx, i) => (
          <div
            key={i}
            onClick={() => onNavigate("detail")}
            className="bg-dark-card rounded-2xl p-3 px-[14px] mb-2 flex items-center gap-3 cursor-pointer border border-dark-border hover:border-dark-muted transition-colors"
          >
            <Avatar 
              name={tx.product} 
              size={44} 
              bg="bg-dark-card-alt" 
              textColor="text-accent" 
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {tx.product}
              </div>
              <div className="text-[11px] text-dark-muted">
                {tx.serial ? tx.serial.slice(0, 16) : `x${tx.qty} units`} · {tx.date}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[13px] font-bold text-white mb-[2px]">
                {tx.action}
              </div>
              <div className="flex items-center justify-end">
                <StatusDot status={tx.status} />
                <span className="text-[11px] text-dark-muted">{tx.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
