"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { PRODUCTS, type Product } from "@/lib/constants"
import { PhoneFrame } from "@/components/phone-frame"
import { Login } from "@/components/screens/login"
import { Dashboard } from "@/components/screens/dashboard"
import { Products } from "@/components/screens/products"
import { Detail } from "@/components/screens/detail"
import { Issue } from "@/components/screens/issue"
import { Return } from "@/components/screens/return"
import { Stock } from "@/components/screens/stock"
import { Scan } from "@/components/screens/scan"

export default function Home() {
  const { user, logout, isLoading } = useAuth()
  const [screen, setScreen] = useState("dashboard")
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0])
  const [toast, setToast] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2600)
  }

  const handleNavigate = (page: string) => {
    setScreen(page)
  }

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleAction = (act: string) => {
    // Action handling (issue, return, etc.)
    console.log("Action:", act)
  }

  const handleSubmit = async (type: string, data: Record<string, unknown>) => {
    // In production, this would call the API
    console.log(`${type} submission:`, data)
    return Promise.resolve()
  }

  const handleLogout = () => {
    logout()
    setScreen("dashboard")
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex justify-center items-center">
        <div className="text-dark-muted">Loading...</div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />
  }

  // Determine if nav should be shown
  const showNav = !["issue", "return", "stock", "scan", "detail"].includes(screen)

  // Get the current screen component
  const getScreenContent = () => {
    switch (screen) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />
      case "products":
        return (
          <Products 
            onSelectProduct={handleSelectProduct} 
            onNavigate={handleNavigate} 
          />
        )
      case "detail":
        return (
          <Detail 
            product={selectedProduct} 
            onNavigate={handleNavigate} 
            onAction={handleAction} 
          />
        )
      case "issue":
        return (
          <Issue 
            product={selectedProduct} 
            onNavigate={handleNavigate} 
            onSubmit={handleSubmit} 
            onToast={showToast} 
          />
        )
      case "return":
        return (
          <Return 
            product={selectedProduct} 
            onNavigate={handleNavigate} 
            onSubmit={handleSubmit} 
            onToast={showToast} 
          />
        )
      case "stock":
        return (
          <Stock 
            onNavigate={handleNavigate} 
            onSubmit={handleSubmit} 
            onToast={showToast} 
          />
        )
      case "scan":
        return (
          <Scan 
            onNavigate={handleNavigate} 
            onToast={showToast} 
          />
        )
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <PhoneFrame
      screen={screen}
      toast={toast}
      showNav={showNav}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {getScreenContent()}
    </PhoneFrame>
  )
}
