import { NextResponse } from "next/server"
import { PRODUCTS } from "@/lib/constants"

// GET - Fetch products
export async function GET() {
  // In production, this would fetch from Google Sheets
  return NextResponse.json({ products: PRODUCTS })
}

// POST - Handle issue, return, stock operations
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    // In production, this would update Google Sheets
    console.log(`${action} operation:`, data)
    
    return NextResponse.json({
      success: true,
      message: `${action} operation completed successfully`,
      timestamp: new Date().toISOString()
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Operation failed" },
      { status: 500 }
    )
  }
}
