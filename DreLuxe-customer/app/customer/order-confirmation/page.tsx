"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { ArrowLeft, Check, Fingerprint, Info } from "lucide-react"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Sample order data
  const order = {
    items: [
      { id: "shirt", name: "Shirt", price: 60, quantity: 2 },
      { id: "pants", name: "Pants", price: 80, quantity: 1 },
    ],
    subtotal: 200,
    tax: 36,
    delivery: 40,
    total: 276,
  }

  // Handle biometric verification
  const handleBiometricVerify = () => {
    setIsVerifying(true)

    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false)

      // Show success message
      toast({
        title: "Verification Successful",
        description: "Your identity has been verified",
      })
    }, 2000)
  }

  // Handle order confirmation
  const handleConfirmOrder = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Order Placed Successfully",
        description: "Your order has been confirmed",
      })

      // Navigate to dashboard
      setTimeout(() => {
        router.push("/customer/dashboard")
      }, 1000)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#F5F7FA] to-[#E8F4FD]">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push("/customer/items")}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-semibold">Order Confirmation</h1>
          </div>

          <Logo width={100} height={50} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <Card>
              <CardContent className="p-4">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">GST (18%)</span>
                      <span>₹{order.tax}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>₹{order.delivery}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fabric Care Instructions */}
            <Card>
              <CardContent className="p-4">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Fabric Care Instructions</h2>

                <div className="flex flex-wrap gap-3">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md border border-gray-200 p-1">
                    <img src="/placeholder.svg?height=32&width=32" alt="Machine Wash" className="h-6 w-6" />
                    <span className="mt-1 text-xs">30°C</span>
                  </div>

                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md border border-gray-200 p-1">
                    <img src="/placeholder.svg?height=32&width=32" alt="No Bleach" className="h-6 w-6" />
                    <span className="mt-1 text-xs">No Bleach</span>
                  </div>

                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md border border-gray-200 p-1">
                    <img src="/placeholder.svg?height=32&width=32" alt="Iron Medium" className="h-6 w-6" />
                    <span className="mt-1 text-xs">Medium</span>
                  </div>

                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md border border-gray-200 p-1">
                    <img src="/placeholder.svg?height=32&width=32" alt="Dry Clean" className="h-6 w-6" />
                    <span className="mt-1 text-xs">Dry Clean</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="terms">
                <AccordionTrigger className="text-sm font-medium">Terms and Conditions</AccordionTrigger>
                <AccordionContent className="text-xs text-gray-600">
                  <p className="mb-2">
                    By confirming this order, you agree to DreLuxe's terms of service and privacy policy.
                  </p>
                  <p className="mb-2">
                    We are not responsible for any damage to items that occurs during normal cleaning processes that are
                    appropriate for the fabric type.
                  </p>
                  <p>Delivery times are estimates and may vary based on traffic and weather conditions.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Biometric Verification */}
            {order.total > 2000 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="mt-0.5 text-amber-600" />
                    <div>
                      <h3 className="font-medium text-amber-800">Verification Required</h3>
                      <p className="mb-3 text-sm text-amber-700">Orders above ₹2000 require identity verification</p>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200"
                        onClick={handleBiometricVerify}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-800 border-t-transparent"></div>
                        ) : (
                          <Fingerprint size={16} />
                        )}
                        Verify Identity
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirm Button */}
            <Button
              className="w-full bg-gradient-to-r from-[#4A90E2] to-[#2A70C2] hover:opacity-90"
              onClick={handleConfirmOrder}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check size={18} />
                  <span>Confirm Order</span>
                </div>
              )}
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
