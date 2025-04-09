"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requireSetup?: boolean
}

export function ProtectedRoute({ children, requireSetup = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/customer")
      } else if (requireSetup && user.isNewUser) {
        // Check if we're already on one of the setup pages
        const currentPath = window.location.pathname

        // Define the setup flow in order
        const setupFlow = ["/customer/address", "/customer/preferences", "/customer/payment"]

        // If we're not on any setup page, start from the beginning
        if (!setupFlow.includes(currentPath)) {
          router.push(setupFlow[0])
        }
        // Otherwise, we're already on a setup page, so don't redirect
      }
    }
  }, [user, isLoading, router, requireSetup])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
