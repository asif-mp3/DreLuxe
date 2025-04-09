import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { addressDB } from "@/lib/db-service"

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would verify the JWT token
    // For demo purposes, we'll use a hardcoded user ID
    const userId = "user123"

    // Get addresses from database
    const addresses = addressDB.findByUserId(userId)

    return NextResponse.json({
      success: true,
      addresses,
    })
  } catch (error) {
    console.error("Error getting addresses:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Get token from cookies
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would verify the JWT token
    // For demo purposes, we'll use a hardcoded user ID
    const userId = "user123"

    // Get request body
    const body = await request.json()

    // Validate input
    if (!body.street || !body.city || !body.state || !body.zipCode) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Update or create address
    const addresses = addressDB.findByUserId(userId)
    let address

    if (addresses.length > 0) {
      address = addressDB.update(userId, { ...body, userId })
    } else {
      address = addressDB.create({ ...body, userId })
    }

    return NextResponse.json({
      success: true,
      address,
    })
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
