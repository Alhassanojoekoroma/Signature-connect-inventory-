"use client"

import { cn } from "@/lib/utils"
import { NavButton } from "@/components/ui/nav-button"
import { Toast } from "@/components/ui/toast"

interface PhoneFrameProps {
  children: React.ReactNode
  screen: string
  toast?: string
  showNav?: boolean
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function PhoneFrame({ 
  children, 
  screen, 
  toast = "",
  showNav = true,
  onNavigate,
  onLogout
}: PhoneFrameProps) {
  const isLight = ["detail", "issue", "return", "stock"].includes(screen)
  
  return (
    <div className="bg-background min-h-screen flex justify-center items-start p-7 pb-6">
      <div
        className={cn(
          "w-[375px] rounded-[46px] overflow-hidden flex flex-col h-[760px] relative",
          isLight ? "bg-light-bg" : "bg-dark-bg"
        )}
        style={{
          boxShadow: "0 0 0 8px #111, 0 0 0 10px #3A3A3A, 0 28px 70px rgba(0,0,0,0.45)"
        }}
      >
        {/* Status Bar */}
        <div
          className={cn(
            "h-[46px] flex items-center justify-between px-[26px] shrink-0",
            isLight ? "bg-light-bg" : "bg-[#0A0A0A]"
          )}
        >
          <span className={cn("text-sm font-bold", isLight ? "text-foreground" : "text-white")}>
            9:41
          </span>
          <div 
            className={cn(
              "w-[110px] h-[22px] rounded-xl bg-[#0A0A0A] absolute left-1/2 -translate-x-1/2",
              isLight && "border border-[#DDD]"
            )}
          />
          <span className={cn("text-xs tracking-widest", isLight ? "text-[#555]" : "text-[#888]")}>
            {"●▲▌"}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {children}
        </div>

        {/* Toast */}
        {toast && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bg-dark-bg text-white px-[22px] py-[11px] rounded-full text-[13px] font-semibold z-50 whitespace-nowrap border border-dark-border"
            style={{ bottom: showNav ? 80 : 20 }}
          >
            {toast}
          </div>
        )}

        {/* Bottom Nav */}
        {showNav && (
          <div
            className={cn(
              "h-[68px] flex items-center shrink-0 pb-1",
              isLight 
                ? "bg-white border-t border-light-border" 
                : "bg-dark-card border-t border-dark-border"
            )}
          >
            <NavButton
              icon="home"
              label="Home"
              active={screen === "dashboard"}
              light={isLight}
              onClick={() => onNavigate("dashboard")}
            />
            <NavButton
              icon="scan"
              label="Scan"
              active={screen === "scan"}
              light={isLight}
              onClick={() => onNavigate("scan")}
            />
            <NavButton
              icon="products"
              label="Products"
              active={screen === "products"}
              light={isLight}
              onClick={() => onNavigate("products")}
            />
            <NavButton
              icon="profile"
              label="Profile"
              active={false}
              light={isLight}
              onClick={onLogout}
            />
          </div>
        )}
      </div>
    </div>
  )
}
