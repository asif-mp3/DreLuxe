import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // 1. Always allow direct access to root path (landing page)
  if (pathname === "/") {
    return NextResponse.next()
  }

  // 2. Handle /customer path (login/auth page)
  if (pathname === "/customer") {
    // If user is already logged in, let the client-side handle the redirection
    return NextResponse.next()
  }

  // 3. Handle customer sub-routes
  if (pathname.startsWith("/customer/")) {
    // Public sub-routes that don't require auth
    const publicRoutes = [
      "/customer/register",
      "/customer/verify",
      "/customer/forgot-password",
      "/customer/reset-password",
    ]

    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

    // Allow access to public routes without authentication
    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Protected routes require authentication
    if (!token) {
      return NextResponse.redirect(new URL("/customer", request.url))
    }

    // For all other protected routes
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/customer", "/customer/:path*"],
}
