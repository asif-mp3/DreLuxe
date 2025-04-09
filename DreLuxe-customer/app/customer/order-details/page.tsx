"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { ArrowLeft, Calendar, Clock, Download, MapPin, MessageSquare, Truck } from "lucide-react"
import Image from "next/image"

export default function OrderDetailsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

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
    warning: "text-[#FFA500]"
  }

  // Sample order data
  const order = {
    id: "ORD-12345",
    status: "washing", // pickup, washing, drying, delivery, completed
    date: "May 20, 2023",
    items: [
      { id: "1", name: "Shirts", quantity: 3, price: 60, total: 180 },
      { id: "2", name: "Pants", quantity: 2, price: 80, total: 160 },
      { id: "3", name: "Jackets", quantity: 1, price: 120, total: 120 },
    ],
    subtotal: 460,
    tax: 82.8,
    delivery: 40,
    total: 582.8,
    pickupAddress: "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001",
    pickupTime: "May 20, 2023, 10:30 AM",
    deliveryAddress: "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001",
    deliveryTime: "May 22, 2023, 6:00 PM",
    paymentMethod: "UPI - john@okicici",
  }

  const handleDownloadInvoice = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Invoice Downloaded",
        description: "Invoice has been saved to your downloads folder",
      })
    }, 1500)
  }

  const handleContactSupport = () => {
    toast({
      title: "Support Chat",
      description: "Connecting you to customer support...",
    })
    setTimeout(() => {
      router.push("/customer/support")
    }, 1000)
  }

  return (
    <div className={`flex min-h-screen flex-col ${colors.background}`}>
      <Toaster />

      {/* Header */}
      <header className={`sticky top-0 z-10 ${colors.card} p-4 border-b ${colors.divider}`}>
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${colors.buttonOutline}`}
              onClick={() => router.push("/customer/dashboard")}
            >
              <ArrowLeft size={20} className={colors.textPrimary} />
            </Button>
            <h1 className={`text-lg font-semibold ${colors.textPrimary}`}>Order Details</h1>
          </div>

          <Logo width={100} height={50} variant="dark" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* Order Header */}
            <Card className={`mb-6 overflow-hidden border ${colors.divider}`}>
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r from-[#1DB954]/80 to-[#1DB954] p-4 ${colors.textPrimary}`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                    <span className={`rounded-full bg-white/20 px-2 py-1 text-xs ${colors.textPrimary}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
                    <Calendar size={14} />
                    <span>{order.date}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-1 text-xs ${colors.buttonOutline}`}
                      onClick={() => router.push("/customer/tracking")}
                    >
                      <Truck size={14} className={colors.icon} />
                      Track Order
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-1 text-xs ${colors.buttonOutline}`}
                      onClick={handleDownloadInvoice}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className={`h-3 w-3 animate-spin rounded-full border-2 ${colors.divider} border-t-[#1DB954]`}></div>
                      ) : (
                        <Download size={14} className={colors.icon} />
                      )}
                      Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className={`mb-6 border ${colors.divider}`}>
              <CardContent className="p-4">
                <h2 className={`mb-4 text-lg font-semibold ${colors.textPrimary}`}>Order Items</h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src="/placeholder.svg?height=48&width=48"
                            alt={item.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className={`font-medium ${colors.textPrimary}`}>{item.name}</h3>
                          <p className={`text-sm ${colors.textSecondary}`}>
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className={`font-medium ${colors.textPrimary}`}>₹{item.total}</p>
                    </div>
                  ))}

                  <Separator className={colors.divider} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={colors.textSecondary}>Subtotal</span>
                      <span className={colors.textPrimary}>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={colors.textSecondary}>GST (18%)</span>
                      <span className={colors.textPrimary}>₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={colors.textSecondary}>Delivery Fee</span>
                      <span className={colors.textPrimary}>₹{order.delivery.toFixed(2)}</span>
                    </div>
                    <Separator className={colors.divider} />
                    <div className="flex items-center justify-between font-medium">
                      <span className={colors.textPrimary}>Total</span>
                      <span className={colors.textPrimary}>₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pickup & Delivery */}
            <Card className={`mb-6 border ${colors.divider}`}>
              <CardContent className="p-4">
                <h2 className={`mb-4 text-lg font-semibold ${colors.textPrimary}`}>Pickup & Delivery</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.accent}/10`}>
                      <MapPin size={20} className={colors.icon} />
                    </div>
                    <div>
                      <p className={`font-medium ${colors.textPrimary}`}>Pickup Address</p>
                      <p className={`text-sm ${colors.textSecondary}`}>{order.pickupAddress}</p>
                      <div className="mt-1 flex items-center gap-1 text-sm">
                        <Clock size={14} className={colors.textSecondary} />
                        <span className={colors.textSecondary}>{order.pickupTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.accent}/10`}>
                      <MapPin size={20} className={colors.icon} />
                    </div>
                    <div>
                      <p className={`font-medium ${colors.textPrimary}`}>Delivery Address</p>
                      <p className={`text-sm ${colors.textSecondary}`}>{order.deliveryAddress}</p>
                      <div className="mt-1 flex items-center gap-1 text-sm">
                        <Clock size={14} className={colors.textSecondary} />
                        <span className={colors.textSecondary}>{order.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className={`mb-6 border ${colors.divider}`}>
              <CardContent className="p-4">
                <h2 className={`mb-4 text-lg font-semibold ${colors.textPrimary}`}>Payment Information</h2>

                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.accent}/10`}>
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="Payment"
                      width={20}
                      height={20}
                      className={colors.icon}
                    />
                  </div>
                  <div>
                    <p className={`font-medium ${colors.textPrimary}`}>Payment Method</p>
                    <p className={`text-sm ${colors.textSecondary}`}>{order.paymentMethod}</p>
                    <p className={`mt-1 text-sm ${colors.success}`}>Paid</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Button
              variant="outline"
              className={`mb-6 w-full flex items-center justify-center gap-2 ${colors.buttonOutline}`}
              onClick={handleContactSupport}
            >
              <MessageSquare size={18} className={colors.icon} />
              Contact Support
            </Button>

            {/* Reorder Button */}
            <Button
              className={`w-full ${colors.button}`}
              onClick={() => router.push("/customer/items")}
            >
              Reorder
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}