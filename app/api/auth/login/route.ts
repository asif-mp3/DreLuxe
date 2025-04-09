import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    // In a real app, you would validate credentials against a database
    if (identifier === "user@example.com" && password === "pass123") {
      // Generate a JWT token (in a real app)
      const token = "sample-jwt-token"

      // Set a secure HTTP-only cookie
      cookies().set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return NextResponse.json({
        success: true,
        user: {
          id: "user123",
          email: identifier,
          name: "John Doe",
        },
      })
    }

    // Invalid credentials
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
