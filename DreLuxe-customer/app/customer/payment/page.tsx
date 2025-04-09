"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { CreditCard, QrCode, Smartphone } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

export default function PaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { updateUser } = useAuth()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [isScanning, setIsScanning] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })
  const [upiId, setUpiId] = useState("")

  // Spotify-inspired color palette
  const colors = {
    background: "bg-[#121212]",
    card: "bg-[#181818]",
    cardHover: "hover:bg-[#282828]",
    textPrimary: "text-[#ffffff]",
    textSecondary: "text-[#b3b3b3]",
    accent: "bg-[#1DB954]",
    accentHover: "hover:bg-[#1ed760]",
    icon: "text-[#1DB954]",
    divider: "border-[#282828]",
    button: "bg-[#1DB954] text-white hover:bg-[#1ed760]",
    buttonOutline: "border-[#535353] text-white hover:bg-[#282828] hover:border-[#1DB954]",
  }

  // Format card number as user types
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digits
    const value = e.target.value.replace(/\D/g, "")

    // Format as 4-4-4-4
    if (value.length <= 16) {
      let formatted = ""
      for (let i = 0; i < value.length; i += 4) {
        const chunk = value.slice(i, i + 4)
        formatted += chunk + (i < 12 && i + 4 < value.length ? " " : "")
      }

      setCardDetails({ ...cardDetails, number: formatted.trim() })

      // Identify card type based on first digit
      const firstDigit = value[0]
      if (firstDigit === "4") {
        // Visa
      } else if (firstDigit === "5") {
        // Mastercard
      }
    }
  }

  // Format expiry date as user types
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digits
    const value = e.target.value.replace(/\D/g, "")

    // Format as MM/YY
    if (value.length <= 4) {
      let formatted = value
      if (value.length > 2) {
        formatted = value.slice(0, 2) + "/" + value.slice(2)
      }

      setCardDetails({ ...cardDetails, expiry: formatted })
    }
  }

  // Handle UPI ID input
  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUpiId(value)

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/
    if (value && !upiRegex.test(value)) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID (e.g., name@upi)",
        variant: "destructive",
      })
    }
  }

  // Start QR code scanner
  const startScanner = async () => {
    setIsScanning(true)

    try {
      // In a real app, this would use a QR code scanning library
      // For now, we'll just simulate scanning
      setTimeout(() => {
        setIsScanning(false)
        setUpiId("john@okicici")

        toast({
          title: "QR Code Scanned",
          description: "UPI ID detected: john@okicici",
        })
      }, 2000)
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsScanning(false)

      toast({
        title: "Camera access denied",
        description: "Please allow camera access or enter UPI ID manually",
        variant: "destructive",
      })
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form based on payment method
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all card details",
          variant: "destructive",
        })
        return
      }

      // Validate card number (simple check)
      if (cardDetails.number.replace(/\s/g, "").length !== 16) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number",
          variant: "destructive",
        })
        return
      }

      // Validate expiry date
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
      if (!expiryRegex.test(cardDetails.expiry)) {
        toast({
          title: "Invalid expiry date",
          description: "Please enter a valid expiry date (MM/YY)",
          variant: "destructive",
        })
        return
      }

      // Validate CVV
      if (cardDetails.cvv.length !== 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid 3-digit CVV",
          variant: "destructive",
        })
        return
      }
    } else if (paymentMethod === "upi") {
      // Validate UPI ID
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/
      if (!upiId || !upiRegex.test(upiId)) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., name@upi)",
          variant: "destructive",
        })
        return
      }
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Save payment method to localStorage for demo purposes
      localStorage.setItem(
        "user_payment",
        JSON.stringify({
          method: paymentMethod,
          details: paymentMethod === "card" ? cardDetails : { upiId },
        }),
      )

      // Update user setup status - IMPORTANT: Set isNewUser to false
      // Use the updateUser function from auth context to ensure proper state update
      updateUser({ isNewUser: false })

      toast({
        title: "Payment method saved",
        description: "Your payment method has been saved",
      })

      // Navigate to dashboard
      router.push("/customer/dashboard")
    }, 1500)
  }

  return (
    <div className={`flex min-h-screen flex-col ${colors.background} p-4`}>
      <Toaster />

      <div className="mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <Logo width={150} height={75} variant="dark" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`rounded-xl ${colors.card} p-6 shadow-lg border ${colors.divider}`}
        >
          <h1 className={`mb-6 text-center text-2xl font-bold ${colors.textPrimary}`}>Payment Setup</h1>

          {/* Payment Method Selection */}
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6 grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
                  paymentMethod === "upi" ? "bg-[#1DB954]/20" : "bg-[#282828]/50"
                }`}
              >
                <Smartphone size={32} className={paymentMethod === "upi" ? "text-[#1DB954]" : colors.textSecondary} />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" className="border-[#1DB954]" />
                <Label htmlFor="upi" className={colors.textPrimary}>
                  UPI
                </Label>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
                  paymentMethod === "card" ? "bg-[#1DB954]/20" : "bg-[#282828]/50"
                }`}
              >
                <CreditCard size={32} className={paymentMethod === "card" ? "text-[#1DB954]" : colors.textSecondary} />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" className="border-[#1DB954]" />
                <Label htmlFor="card" className={colors.textPrimary}>
                  Card
                </Label>
              </div>
            </div>
          </RadioGroup>

          {/* UPI Payment Form */}
          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi-id" className={colors.textPrimary}>
                  UPI ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="upi-id"
                    value={upiId}
                    onChange={handleUpiIdChange}
                    placeholder="name@upi"
                    className={`flex-1 ${colors.card} border-[#282828] ${colors.textPrimary}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startScanner}
                    disabled={isScanning}
                    className={colors.buttonOutline}
                  >
                    <QrCode size={18} />
                  </Button>
                </div>
              </div>

              {/* QR Scanner */}
              {isScanning && (
                <div className="relative mt-4 h-48 w-full overflow-hidden rounded-lg bg-black">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-32 w-32 animate-pulse rounded-lg border-2 border-dashed border-white"></div>
                    <p className="absolute bottom-2 left-0 right-0 text-center text-sm text-white">
                      Scanning QR code...
                    </p>
                  </div>
                </div>
              )}

              <Button className={`w-full ${colors.button}`} onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Payment Method"}
              </Button>
            </div>
          )}

          {/* Card Payment Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number" className={colors.textPrimary}>
                  Card Number
                </Label>
                <Input
                  id="card-number"
                  value={cardDetails.number}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  className={`${colors.card} ${colors.textPrimary} border-[#282828]`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-name" className={colors.textPrimary}>
                  Cardholder Name
                </Label>
                <Input
                  id="card-name"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  placeholder="John Doe"
                  className={`${colors.card} ${colors.textPrimary} border-[#282828]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry" className={colors.textPrimary}>
                    Expiry Date
                  </Label>
                  <Input
                    id="card-expiry"
                    value={cardDetails.expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    className={`${colors.card} ${colors.textPrimary} border-[#282828]`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-cvv" className={colors.textPrimary}>
                    CVV
                  </Label>
                  <Input
                    id="card-cvv"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      if (value.length <= 3) {
                        setCardDetails({ ...cardDetails, cvv: value })
                      }
                    }}
                    placeholder="123"
                    inputMode="numeric"
                    className={`${colors.card} ${colors.textPrimary} border-[#282828]`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 py-2">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=100&auto=format&fit=crop"
                  alt="Visa"
                  width={40}
                  height={24}
                  className="rounded-md"
                />
                <Image
                  src="https://images.unsplash.com/photo-1542370285-b8eb8317691c?q=80&w=100&auto=format&fit=crop"
                  alt="Mastercard"
                  width={40}
                  height={24}
                  className="rounded-md"
                />
                <Image
                  src="https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=100&auto=format&fit=crop"
                  alt="Amex"
                  width={40}
                  height={24}
                  className="rounded-md"
                />
              </div>

              <Button className={`w-full ${colors.button}`} onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Payment Method"}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
