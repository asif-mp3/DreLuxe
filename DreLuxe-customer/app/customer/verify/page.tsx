"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { RefreshCw, CheckCircle } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [timeLeft, setTimeLeft] = useState(30)
  const [isResending, setIsResending] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [twoFactorCode, setTwoFactorCode] = useState<string[]>(Array(6).fill(""))

  // Spotify-inspired color palette
  const colors = {
    background: "bg-[#121212]",
    card: "bg-[#181818] hover:bg-[#282828]",
    textPrimary: "text-[#ffffff]",
    textSecondary: "text-[#b3b3b3]",
    accent: "bg-[#1DB954]",
    accentHover: "hover:bg-[#1ed760]",
    icon: "text-[#1DB954]",
    divider: "border-[#282828]",
    button: "bg-[#1DB954] text-white hover:bg-[#1ed760]",
    buttonOutline: "border-[#535353] text-white hover:bg-[#282828] hover:border-[#1DB954]",
    danger: "text-[#ff4d4d] border-[#ff4d4d] hover:bg-[#ff4d4d]/10",
    success: "text-[#1DB954]",
  }

  useEffect(() => {
    if (timeLeft > 0 && !isResending) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isResending])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (value && index === 5) {
      const otpValue = [...newOtp.slice(0, 5), value].join("")
      if (otpValue.length === 6) {
        verifyOtp()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const resendOtp = () => {
    if (timeLeft > 0) return
    setIsResending(true)

    setTimeout(() => {
      setTimeLeft(attempts === 0 ? 30 : attempts === 1 ? 60 : 120)
      setIsResending(false)
      setAttempts(attempts + 1)
      if (navigator.vibrate) navigator.vibrate(50)
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your phone",
      })
    }, 1500)
  }

  const verifyOtp = () => {
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      toast({
        title: "Incomplete OTP",
        description: "Please enter all 6 digits of the verification code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (otpValue === "123456") {
        setIsVerified(true)
        if (navigator.vibrate) navigator.vibrate(50)
        toast({
          title: "Verification Successful",
          description: "Your account has been verified",
        })
        setTimeout(() => {
          router.push("/customer/address")
        }, 1500)
        return
      }

      setAttempts(attempts + 1)
      setOtp(Array(6).fill(""))
      inputRefs.current[0]?.focus()
      if (attempts >= 2) setShowCaptcha(true)
      toast({
        title: "Invalid OTP",
        description: "The verification code you entered is incorrect. Hint: use 123456",
        variant: "destructive",
      })
    }, 1500)
  }

  const solveCaptcha = () => {
    setShowCaptcha(false)
    setAttempts(0)
    toast({
      title: "CAPTCHA Solved",
      description: "You can now try entering the OTP again",
    })
  }

  const handleVerifyTwoFactor = async () => {
    const code = twoFactorCode.join("")

    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter all 6 digits",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, any code works
      toast({
        title: "Verification successful",
        description: "Two-factor authentication completed",
      })

      // Navigate to address page for setup
      router.push("/customer/address")
    } catch (error) {
      console.error("2FA verification error:", error)
      toast({
        title: "Verification error",
        description: "Invalid code. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center ${colors.background} p-4`}>
      <Toaster />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo width={150} height={75} variant="dark" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`w-full max-w-md rounded-xl ${colors.card} p-6 shadow-lg border ${colors.divider}`}
      >
        {isVerified ? (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <CheckCircle size={80} className={`mb-4 ${colors.success}`} />
            </motion.div>
            <h2 className={`mb-2 text-2xl font-bold ${colors.textPrimary}`}>Verification Complete</h2>
            <p className={`mb-6 text-center ${colors.textSecondary}`}>
              Your account has been successfully verified. Redirecting...
            </p>
          </div>
        ) : showCaptcha ? (
          <div className="flex flex-col items-center justify-center py-4">
            <h2 className={`mb-6 text-xl font-bold ${colors.textPrimary}`}>Security Check</h2>

            {/* Simple sliding puzzle CAPTCHA */}
            <div className="mb-6 grid grid-cols-3 gap-1">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`flex h-16 w-16 items-center justify-center rounded ${colors.accent}/10 text-lg font-bold ${colors.icon}`}
                  >
                    {i + 1}
                  </div>
                ))}
              <div className={`h-16 w-16 rounded ${colors.card}`}></div>
            </div>

            <p className={`mb-4 text-center text-sm ${colors.textSecondary}`}>
              Solve the puzzle by arranging the numbers in order
            </p>

            <Button onClick={solveCaptcha} className={colors.button}>
              I've Completed the Puzzle
            </Button>
          </div>
        ) : (
          <>
            <h1 className={`mb-2 text-center text-2xl font-bold ${colors.textPrimary}`}>Verify Your Account</h1>
            <p className={`mb-6 text-center ${colors.textSecondary}`}>
              We've sent a 6-digit verification code to your phone
            </p>
            <p className={`mb-6 text-center text-sm ${colors.textSecondary}`}>
              Hint: Use <span className="font-medium">123456</span> for demo
            </p>

            {/* OTP Input */}
            <div className="mb-6 flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`h-12 w-12 rounded-md border ${colors.divider} text-center text-xl ${colors.textPrimary} ${colors.card} focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]`}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="mb-6 flex flex-col items-center">
              <p className={`text-sm ${colors.textSecondary}`}>Didn't receive the code?</p>
              <Button
                variant="link"
                disabled={timeLeft > 0 || isResending || isLoading}
                onClick={resendOtp}
                className={`flex items-center gap-1 ${colors.icon}`}
              >
                {isResending && <RefreshCw size={14} className="animate-spin" />}
                {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Code"}
              </Button>
            </div>

            {/* Verify Button */}
            <Button
              className={`w-full ${colors.button}`}
              onClick={verifyOtp}
              disabled={otp.some((digit) => !digit) || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
