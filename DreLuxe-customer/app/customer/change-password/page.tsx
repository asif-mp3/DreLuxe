"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords((prev) => ({ ...prev, [name]: value }))

    // Calculate password strength for new password
    if (name === "new") {
      let strength = 0

      // Length
      if (value.length >= 8) strength += 20
      else strength += value.length * 2

      // Complexity
      if (/[A-Z]/.test(value)) strength += 10
      if (/[a-z]/.test(value)) strength += 10
      if (/[0-9]/.test(value)) strength += 10
      if (/[^A-Za-z0-9]/.test(value)) strength += 15

      // Variety
      const uniqueChars = new Set(value).size
      strength += Math.min(uniqueChars * 2, 15)

      setPasswordStrength(Math.min(strength, 100))
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate inputs
    if (!passwords.current) {
      toast({
        title: "Current password required",
        description: "Please enter your current password",
        variant: "destructive",
      })
      return
    }

    if (passwords.new.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated",
      })

      // Navigate back to profile
      setTimeout(() => {
        router.push("/customer/profile")
      }, 1000)
    }, 1500)
  }

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500"
    if (passwordStrength < 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Get password strength text
  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return "Weak"
    if (passwordStrength < 60) return "Moderate"
    if (passwordStrength < 80) return "Strong"
    return "Rockstar"
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#F5F7FA] to-[#E8F4FD]">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.push("/customer/profile")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-semibold">Change Password</h1>
          </div>

          <Logo width={100} height={50} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Lock size={32} className="text-blue-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current"
                        name="current"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwords.current}
                        onChange={handleInputChange}
                        placeholder="Enter your current password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new"
                        name="new"
                        type={showNewPassword ? "text" : "password"}
                        value={passwords.new}
                        onChange={handleInputChange}
                        placeholder="Enter your new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {passwords.new && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          Strength: {getPasswordStrengthText()}
                          {passwordStrength < 30 && <span className="ml-1 text-red-500">Add symbols/numbers</span>}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm"
                        name="confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={handleInputChange}
                        placeholder="Confirm your new password"
                        className={`pr-10 ${
                          passwords.confirm && passwords.new !== passwords.confirm ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwords.confirm && passwords.new !== passwords.confirm && (
                      <p className="text-xs text-red-500">Passwords don't match</p>
                    )}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-[#4A90E2] to-[#2A70C2] hover:opacity-90"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
