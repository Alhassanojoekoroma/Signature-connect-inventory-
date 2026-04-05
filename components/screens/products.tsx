"use client"

import { useState } from "react"
import { PRODUCTS, type Product } from "@/lib/constants"
import { Avatar } from "@/components/ui/avatar"
import { StatusDot } from "@/components/ui/status-dot"
import { Search } from "lucide-react"

interface ProductsProps {
  onSelectProduct: (product: Product) => void
  onNavigate: (page: string) => void
}

export function Products({ onSelectProduct, onNavigate }: ProductsProps) {
  const [search, setSearch] = useState("")

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product)
    onNavigate("detail")
  }

  const getAvatarColors = (status: string) => {
    if (status === "Out of Stock") {
      return { bg: "bg-[#2A1212]", text: "text-status-danger" }
    }
    if (status === "Low Stock") {
      return { bg: "bg-[#2A2010]", text: "text-status-warning" }
    }
    return { bg: "bg-dark-card-alt", text: "text-accent" }
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-5 pt-[14px] shrink-0">
        <div className="text-[22px] font-extrabold text-white mb-3">
          Products
        </div>
        <div className="bg-dark-card rounded-xl px-3 mb-[14px] flex items-center border border-dark-border">
          <Search size={16} className="text-dark-muted" />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white py-[11px] px-2 flex-1 text-sm placeholder:text-dark-muted"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="px-5 pb-4 flex-1">
        {filteredProducts.map((p) => {
          const colors = getAvatarColors(p.status)
          return (
            <div
              key={p.id}
              onClick={() => handleSelectProduct(p)}
              className="bg-dark-card rounded-2xl p-3 px-[14px] mb-2 flex items-center gap-3 cursor-pointer border border-dark-border hover:border-dark-muted transition-colors"
            >
              <Avatar 
                name={p.name} 
                size={44} 
                bg={colors.bg} 
                textColor={colors.text}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {p.name}
                </div>
                <div className="text-[11px] text-dark-muted">
                  {p.cat} · {p.serials.length || "No"} serial{p.serials.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[22px] font-extrabold text-white">
                  {p.stock}
                </div>
                <div className="flex items-center justify-end">
                  <StatusDot status={p.status} />
                  <span className="text-[10px] text-dark-muted">{p.status}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
