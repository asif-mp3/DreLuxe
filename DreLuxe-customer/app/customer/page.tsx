"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Fingerprint, Lock, Mail, Phone, AlertTriangle, ArrowRight, Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ParticleBackground } from "@/components/particle-background"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)
  const [identifierType, setIdentifierType] = useState<"email" | "phone" | "">("")
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpOption, setShowOtpOption] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""])
  const twoFactorInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [isOffline, setIsOffline] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)

  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine)
    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)
    handleOnlineStatus()

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  // Check if account is locked
  useEffect(() => {
    const lockedUntil = localStorage.getItem("account_locked_until")
    if (lockedUntil) {
      const lockTime = Number.parseInt(lockedUntil)
      if (lockTime > Date.now()) {
        setIsLocked(true)
        const remainingTime = Math.ceil((lockTime - Date.now()) / 1000)
        setLockTimer(remainingTime)
      } else {
        localStorage.removeItem("account_locked_until")
      }
    }

    // Check if biometric authentication is available
    const checkBiometricAvailability = async () => {
      try {
        // This is a simplified check - in a real app, you'd use the Web Authentication API
        // or a library like @simplewebauthn/browser
        const isSecureContext = window.isSecureContext
        const isHttps = window.location.protocol === "https:"
        setIsBiometricAvailable(isSecureContext || isHttps)
      } catch (error) {
        console.error("Error checking biometric availability:", error)
        setIsBiometricAvailable(false)
      }
    }

    // Check for low-end device
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      setIsLowEndDevice(true)
    }

    // Check for saved credentials
    const savedIdentifier = localStorage.getItem("saved_identifier")
    if (savedIdentifier) {
      setIdentifier(savedIdentifier)
      setRememberMe(true)
    }

    checkBiometricAvailability()
  }, [])

  // Countdown timer for locked account
  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setIsLocked(false)
            localStorage.removeItem("account_locked_until")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isLocked, lockTimer])

  // Auto-detect identifier type (email or phone)
  useEffect(() => {
    if (identifier.includes("@")) {
      setIdentifierType("email")
    } else if (/^\d+$/.test(identifier)) {
      setIdentifierType("phone")
    } else {
      setIdentifierType("")
    }
  }, [identifier])

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0

    // Length
    if (password.length >= 8) strength += 20
    else strength += password.length * 2

    // Complexity
    if (/[A-Z]/.test(password)) strength += 10
    if (/[a-z]/.test(password)) strength += 10
    if (/[0-9]/.test(password)) strength += 10
    if (/[^A-Za-z0-9]/.test(password)) strength += 15

    // Variety
    const uniqueChars = new Set(password).size
    strength += Math.min(uniqueChars * 2, 15)

    setPasswordStrength(Math.min(strength, 100))
  }, [password])

  // Handle 2FA input
  const handleTwoFactorInput = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste event
      if (/^\d+$/.test(value) && value.length === 6) {
        const digits = value.split("")
        const newCode = [...twoFactorCode]
        digits.forEach((digit, i) => {
          if (i < 6) newCode[i] = digit
        })
        setTwoFactorCode(newCode)
        twoFactorInputRefs.current[5]?.focus()
      }
      return
    }

    if (/^\d?$/.test(value)) {
      const newCode = [...twoFactorCode]
      newCode[index] = value
      setTwoFactorCode(newCode)

      // Auto-focus next input
      if (value && index < 5) {
        twoFactorInputRefs.current[index + 1]?.focus()
      }
    }
  }

  // Handle backspace in 2FA input
  const handleTwoFactorKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !twoFactorCode[index] && index > 0) {
      twoFactorInputRefs.current[index - 1]?.focus()
    }
  }

  const handleLogin = async () => {
    if (isLocked) return

    // Validate email format
    if (identifierType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    // Validate phone format (simple check)
    if (identifierType === "phone" && !/^\d{10}$/.test(identifier)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem("saved_identifier", identifier)
      } else {
        localStorage.removeItem("saved_identifier")
      }

      // Use the login function from auth context
      await login(identifier, password)

      // The redirect is handled in the login function
    } catch (error) {
      console.error("Login error:", error)

      // Increment login attempts
      setLoginAttempts((prev) => prev + 1)

      // Lock account after 3 failures
      if (loginAttempts >= 2) {
        const lockDuration = 30 * 1000 // 30 seconds
        const lockedUntil = Date.now() + lockDuration
        localStorage.setItem("account_locked_until", lockedUntil.toString())

        setIsLocked(true)
        setLockTimer(30)

        toast({
          title: "Account temporarily locked",
          description: "Too many failed attempts. Please try again in 30 seconds.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again. Hint: use user@example.com / pass123",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Navigate to registration page
      router.push("/customer/register")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    toast({
      title: `${provider} login initiated`,
      description: "Redirecting to authentication provider...",
    })

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to verification page
      router.push("/customer/verify")
    } catch (error) {
      console.error(`${provider} login error:`, error)
      toast({
        title: "Authentication error",
        description: "Failed to authenticate with provider. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBiometricLogin = async () => {
    // Simulate biometric authentication
    toast({
      title: "Biometric authentication",
      description: "Scanning fingerprint...",
    })

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Navigate to dashboard
      router.push("/customer/dashboard")
    } catch (error) {
      console.error("Biometric authentication error:", error)
      toast({
        title: "Authentication error",
        description: "Biometric authentication failed. Please try again or use password.",
        variant: "destructive",
      })
    }
  }

  const handlePasswordReset = async () => {
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      })
      setShowPasswordReset(false)
      setIsLoading(false)
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        title: "Reset error",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
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

      // Navigate to dashboard
      router.push("/customer/dashboard")
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

  const handleRequestOtp = async () => {
    if (!identifier) {
      toast({
        title: "Missing information",
        description: "Please enter your email or phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "OTP sent",
        description:
          identifierType === "email"
            ? "Check your email for the verification code"
            : "Check your phone for the verification code",
      })

      // Navigate to verification page
      router.push("/customer/verify")
    } catch (error) {
      console.error("OTP request error:", error)
      toast({
        title: "OTP error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500"
    if (passwordStrength < 60) return "bg-yellow-500"
    return "bg-primary"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return "Weak"
    if (passwordStrength < 60) return "Moderate"
    if (passwordStrength < 80) return "Strong"
    return "Rockstar"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative">
      <Toaster />
      {!isLowEndDevice && <ParticleBackground />}

      {/* Offline Warning */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 mx-auto w-full max-w-md bg-amber-500 text-black p-3 rounded-lg shadow-lg z-50 flex items-center justify-between"
          >
            <div className="flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              <span>You're offline. Some features may be limited.</span>
            </div>
            <Button variant="ghost" size="sm" className="text-black hover:bg-amber-400">
              Retry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 z-10"
      >
        <Logo width={180} height={90} animated />
      </motion.div>

      <AnimatePresence mode="wait">
        {showPasswordReset ? (
          <motion.div
            key="reset"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg border border-primary/20 z-10"
          >
            <h1 className="mb-6 text-center text-2xl font-bold text-foreground font-montserrat">Reset Password</h1>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 bg-background border-primary/20 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90 btn-hover-effect"
                onClick={handlePasswordReset}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowPasswordReset(false)}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            </div>
          </motion.div>
        ) : showTwoFactor ? (
          <motion.div
            key="2fa"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg border border-primary/20 z-10"
          >
            <h1 className="mb-2 text-center text-2xl font-bold text-foreground font-montserrat">
              Two-Factor Authentication
            </h1>
            <p className="mb-6 text-center text-muted-foreground">Enter the 6-digit code sent to your device</p>

            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {twoFactorCode.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (twoFactorInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleTwoFactorInput(index, e.target.value)}
                    onKeyDown={(e) => handleTwoFactorKeyDown(index, e)}
                    className="h-12 w-12 text-center text-lg bg-background border-primary/20 focus:border-primary"
                    maxLength={1}
                    disabled={isLoading}
                  />
                ))}
              </div>

              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90 btn-hover-effect"
                onClick={handleVerifyTwoFactor}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Didn't receive a code?</p>
                <Button variant="link" className="text-primary" disabled={isLoading}>
                  Resend Code
                </Button>
              </div>

              <Button variant="ghost" className="w-full" onClick={() => setShowTwoFactor(false)} disabled={isLoading}>
                Back to Login
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg border border-primary/20 z-10"
          >
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "login" | "register")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                {/* Email/Phone Input */}
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Phone Number</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      {identifierType === "email" ? (
                        <Mail size={18} className="text-muted-foreground" />
                      ) : identifierType === "phone" ? (
                        <Phone size={18} className="text-muted-foreground" />
                      ) : (
                        <Mail size={18} className="text-muted-foreground" />
                      )}
                    </div>
                    <Input
                      id="identifier"
                      type={identifierType === "phone" ? "tel" : "text"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="email@example.com or phone number"
                      className="h-12 pl-10 bg-background border-primary/20 focus:border-primary"
                      inputMode={identifierType === "phone" ? "numeric" : "email"}
                      disabled={isLocked || isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hint: Use <span className="font-medium text-primary">user@example.com</span> for demo
                  </p>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock size={18} className="text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 pl-10 pr-10 bg-background border-primary/20 focus:border-primary"
                      disabled={isLocked || isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLocked || isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hint: Use <span className="font-medium text-primary">pass123</span> for demo
                  </p>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      disabled={isLocked || isLoading}
                    />
                    <Label htmlFor="remember-me" className="text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="text-primary p-0 h-auto text-sm"
                    onClick={() => setShowPasswordReset(true)}
                    disabled={isLocked || isLoading}
                  >
                    Forgot Password?
                  </Button>
                </div>

                {/* Login Button */}
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 btn-hover-effect"
                  onClick={handleLogin}
                  disabled={isLocked || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : isLocked ? (
                    `Try again in ${lockTimer}s`
                  ) : (
                    "Login"
                  )}
                </Button>

                {/* OTP Option */}
                {!showOtpOption ? (
                  <Button
                    variant="outline"
                    className="w-full border-primary/20"
                    onClick={() => setShowOtpOption(true)}
                    disabled={isLocked || isLoading}
                  >
                    Login with OTP
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-primary/20"
                    onClick={handleRequestOtp}
                    disabled={!identifier || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                )}

                {/* Biometric Login */}
                {isBiometricAvailable && (
                  <Button
                    variant="outline"
                    className="w-full border-primary/20 flex items-center justify-center gap-2"
                    onClick={handleBiometricLogin}
                    disabled={isLocked || isLoading}
                  >
                    <Fingerprint size={18} />
                    Login with Biometrics
                  </Button>
                )}

                {/* Social Logins */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="border-primary/20"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={isLocked || isLoading}
                  >
                    <Image
                      src="/placeholder.svg?height=18&width=18"
                      alt="Google"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary/20"
                    onClick={() => handleSocialLogin("Facebook")}
                    disabled={isLocked || isLoading}
                  >
                    <Image
                      src="/placeholder.svg?height=18&width=18"
                      alt="Facebook"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary/20"
                    onClick={() => handleSocialLogin("Apple")}
                    disabled={isLocked || isLoading}
                  >
                    <Image
                      src="/placeholder.svg?height=18&width=18"
                      alt="Apple"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    Apple
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail size={18} className="text-muted-foreground" />
                    </div>
                    <Input
                      id="register-email"
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="email@example.com"
                      className="h-12 pl-10 bg-background border-primary/20 focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock size={18} className="text-muted-foreground" />
                    </div>
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="h-12 pl-10 pr-10 bg-background border-primary/20 focus:border-primary"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-muted">
                        <motion.div
                          className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Strength: {getPasswordStrengthText()}
                        {passwordStrength < 30 && <span className="ml-1 text-red-500">Add symbols/numbers</span>}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock size={18} className="text-muted-foreground" />
                    </div>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className={`h-12 pl-10 bg-background border-primary/20 focus:border-primary ${
                        confirmPassword && password !== confirmPassword ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords don't match</p>
                  )}
                </div>

                {/* Terms and Marketing */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      I accept the{" "}
                      <Button variant="link" className="p-0 h-auto text-primary text-sm">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-primary text-sm">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={marketingOptIn}
                      onCheckedChange={(checked) => setMarketingOptIn(checked === true)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="marketing" className="text-sm cursor-pointer">
                      I want to receive marketing emails (optional)
                    </Label>
                  </div>
                </div>

                {/* Register Button */}
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 btn-hover-effect"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Social Registrations */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or register with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="border-primary/20"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={isLoading}
                  >
                    <Image
                      src="/placeholder.svg?height=18&width=18"
                      alt="Google"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary/20"
                    onClick={() => handleSocialLogin("Facebook")}
                    disabled={isLoading}
                  >
                    <Image
                      src="/placeholder.svg?height=18&width=18"
                      alt="Facebook"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary/20"
                    onClick={() => handleSocialLogin("Apple")}
                    disabled={isLoading}
                  >
                    <Image
                      src="/placeholder.svg?height=18&width=18"
                      alt="Apple"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    Apple
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Version */}
      <p className="mt-8 text-xs text-muted-foreground z-10">DreLuxe v1.0.0</p>
    </div>
  )
}
