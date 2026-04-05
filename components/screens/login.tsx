"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ChevronDown, Eye, EyeOff } from "lucide-react"

export function Login() {
  const { login } = useAuth()
  const [role, setRole] = useState("Admin")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError("Please enter a password")
      return
    }
    setLoading(true)
    setError("")
    
    // Demo login - accept "admin" or "staff" as passwords
    setTimeout(() => {
      if (password === "admin" || password === "staff") {
        login({
          username: role.toLowerCase(),
          role: role.toLowerCase() as "admin" | "staff",
          token: `demo-token-${Date.now()}`,
        })
      } else {
        setError("Invalid credentials")
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="bg-background min-h-screen flex justify-center items-center p-7">
      <div
        className="w-full max-w-[400px] bg-dark-bg rounded-3xl p-[30px] px-5"
        style={{
          boxShadow: "0 0 0 8px #111, 0 0 0 10px #3A3A3A"
        }}
      >
        <div className="text-center mb-[30px]">
          <div className="text-4xl font-extrabold text-accent mb-2">SC</div>
          <div className="text-lg font-bold text-white">Signature Connect</div>
          <div className="text-xs text-dark-muted mt-1">Inventory Tracking</div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-xs text-dark-muted block mb-[6px]">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full py-3 px-[14px] pr-10 rounded-xl border-[1.5px] border-dark-border bg-dark-card text-white text-sm font-medium cursor-pointer appearance-none"
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
              <ChevronDown 
                size={16} 
                className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-dark-muted" 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-dark-muted block mb-[6px]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full py-3 px-[14px] pr-11 rounded-xl border-[1.5px] border-dark-border bg-dark-card text-white text-sm placeholder:text-dark-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[14px] top-1/2 -translate-y-1/2 bg-transparent border-none text-dark-muted cursor-pointer p-1 flex items-center justify-center"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-status-danger/10 text-status-danger py-[10px] px-3 rounded-lg text-xs mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[14px] rounded-xl border-none bg-accent text-black font-extrabold text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 p-3 bg-dark-card rounded-xl text-[11px] text-dark-muted">
          <div className="font-bold mb-[6px]">Demo Credentials:</div>
          <div>Admin: Pass: admin</div>
          <div>Staff: Pass: staff</div>
        </div>
      </div>
    </div>
  )
}
