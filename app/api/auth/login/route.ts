import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json()
    
    // Simple demo authentication
    if (password === "admin" || password === "staff") {
      const token = `demo-token-${Date.now()}`
      return NextResponse.json({
        token,
        user: { username, role }
      })
    }
    
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}
