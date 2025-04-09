"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  email: string
  name: string
  isNewUser?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const token = document.cookie.includes("auth_token")
        const storedUser = localStorage.getItem("user")

        if (token && storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        // Clear potentially corrupted data
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue))
        } else {
          setUser(null)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "user@example.com" && password === "pass123") {
        const userData = {
          id: "user123",
          email,
          name: "John Doe",
          isNewUser: true, // Set to true to trigger onboarding flow
        }

        // Set cookie and localStorage
        document.cookie = "auth_token=demo-token; path=/; max-age=86400; SameSite=Strict"
        localStorage.setItem("user", JSON.stringify(userData))

        setUser(userData)

        toast({
          title: "Login successful",
          description: `Welcome, ${userData.name}!`,
        })

        // Redirect to verification page first
        router.push("/customer/verify")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Invalid email or password. Try user@example.com / pass123",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear cookie and localStorage
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.removeItem("user")
    localStorage.removeItem("user_address")
    localStorage.removeItem("user_preferences")
    localStorage.removeItem("user_payment")

    setUser(null)

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })

    router.push("/customer")
  }

  const updateUser = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    })
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
