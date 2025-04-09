import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userDB } from "@/lib/db-service"

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

    // Get user from database
    const user = userDB.findById(userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Don't return sensitive information
    const { passwordHash, ...safeUser } = user

    return NextResponse.json({
      success: true,
      user: safeUser,
    })
  } catch (error) {
    console.error("Error getting user:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
