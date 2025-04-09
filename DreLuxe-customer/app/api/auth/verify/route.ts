import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, identifier } = body

    // In a real app, you would validate the OTP against what was sent
    // For demo purposes, any 6-digit code is accepted
    if (code && code.length === 6 && /^\d+$/.test(code)) {
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
        message: "Verification successful",
      })
    }

    // Invalid code
    return NextResponse.json({ success: false, message: "Invalid verification code" }, { status: 400 })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
