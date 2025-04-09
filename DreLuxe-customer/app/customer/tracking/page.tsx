"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { ArrowLeft, Clock, MapPin, Phone, Star, Truck, User } from "lucide-react"
import Image from "next/image"

export default function TrackingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [eta, setEta] = useState("15 minutes")
  const [driverLocation, setDriverLocation] = useState({ lat: 19.076, lng: 72.8777 })
  const [deliveryAddress, setDeliveryAddress] = useState({ lat: 19.0822, lng: 72.8812 })
  const [showPreDeliveryAlert, setShowPreDeliveryAlert] = useState(false)

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
    rating: "bg-[#1DB954]/10 text-[#1DB954]",
    alert: "bg-[#1DB954]/10 text-[#1DB954]",
    button: "bg-[#1DB954] text-white hover:bg-[#1ed760]",
    buttonOutline: "border-[#535353] text-white hover:bg-[#282828] hover:border-[#1DB954]",
  }

  // Simulate loading map and driver data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Simulate driver movement
  useEffect(() => {
    if (isLoading) return

    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        lat: prev.lat + (deliveryAddress.lat - prev.lat) * 0.1,
        lng: prev.lng + (deliveryAddress.lng - prev.lng) * 0.1,
      }))

      const distance = Math.sqrt(
        Math.pow(deliveryAddress.lat - driverLocation.lat, 2) + Math.pow(deliveryAddress.lng - driverLocation.lng, 2),
      )

      const minutesRemaining = Math.max(1, Math.round(distance * 1000))
      setEta(`${minutesRemaining} minutes`)

      if (minutesRemaining <= 5 && !showPreDeliveryAlert) {
        setShowPreDeliveryAlert(true)
        toast({
          title: "Driver Arriving Soon!",
          description: "Your delivery will arrive in about 5 minutes",
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoading, driverLocation, deliveryAddress, showPreDeliveryAlert, toast])

  const handleCallDriver = () => {
    toast({
      title: "Calling Driver",
      description: "Connecting you with Rahul...",
    })
  }

  const driver = {
    name: "Rahul S.",
    phone: "+91 98765 43210",
    vehicle: "Bajaj Chetak",
    vehicleNumber: "MH 01 AB 1234",
    rating: 4.8,
    image: "/placeholder.svg?height=80&width=80",
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
            <h1 className={`text-lg font-semibold ${colors.textPrimary}`}>Track Delivery</h1>
          </div>

          <Logo width={100} height={50} variant="dark" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-md">
          {isLoading ? (
            <div className="space-y-4">
              <div className={`h-64 animate-pulse rounded-xl ${colors.card}`}></div>
              <div className={`h-40 animate-pulse rounded-xl ${colors.card}`}></div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {/* Map */}
              <Card className={`mb-6 overflow-hidden border ${colors.divider}`}>
                <CardContent className="p-0">
                  <div className={`relative h-64 w-full ${colors.card}`}>
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: `url("https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${driverLocation.lng},${driverLocation.lat},14,0/600x400?access_token=pk.dummy")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "brightness(0.8)",
                      }}
                    >
                      {/* Driver Marker */}
                      <div
                        className={`absolute flex h-8 w-8 items-center justify-center rounded-full ${colors.accent} text-white`}
                        style={{
                          left: "30%",
                          top: "40%",
                          transform: "translate(-50%, -50%)",
                          animation: "pulse 1.5s infinite",
                        }}
                      >
                        <Truck size={16} />
                      </div>

                      {/* Destination Marker */}
                      <div
                        className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1DB954]"
                        style={{
                          left: "70%",
                          top: "60%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <MapPin size={16} />
                      </div>
                    </div>

                    {/* ETA Overlay */}
                    <div className={`absolute bottom-4 left-4 rounded-lg ${colors.card} p-3 shadow-md`}>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className={colors.icon} />
                        <div>
                          <p className={`text-sm font-medium ${colors.textSecondary}`}>Estimated Arrival</p>
                          <p className={`text-lg font-bold ${colors.textPrimary}`}>{eta}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Info */}
              <Card className={`mb-6 border ${colors.divider}`}>
                <CardContent className="p-4">
                  <h2 className={`mb-4 text-lg font-semibold ${colors.textPrimary}`}>Delivery Partner</h2>

                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={driver.image || "/placeholder.svg"}
                        alt={driver.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${colors.textPrimary}`}>{driver.name}</h3>
                        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${colors.rating}`}>
                          <Star size={12} className="fill-[#1DB954] text-[#1DB954]" />
                          <span>{driver.rating}</span>
                        </div>
                      </div>
                      <p className={`text-sm ${colors.textSecondary}`}>
                        {driver.vehicle} • {driver.vehicleNumber}
                      </p>
                      <p className={`text-sm ${colors.textSecondary}`}>{driver.phone}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-10 w-10 rounded-full ${colors.buttonOutline} ${colors.textPrimary}`}
                      onClick={handleCallDriver}
                    >
                      <Phone size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Details */}
              <Card className={`border ${colors.divider}`}>
                <CardContent className="p-4">
                  <h2 className={`mb-4 text-lg font-semibold ${colors.textPrimary}`}>Delivery Details</h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.accent}/10`}>
                        <MapPin size={20} className={colors.icon} />
                      </div>
                      <div>
                        <p className={`font-medium ${colors.textPrimary}`}>Delivery Address</p>
                        <p className={`text-sm ${colors.textSecondary}`}>123 Main Street, Apartment 4B</p>
                        <p className={`text-sm ${colors.textSecondary}`}>Mumbai, Maharashtra 400001</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.accent}/10`}>
                        <User size={20} className={colors.icon} />
                      </div>
                      <div>
                        <p className={`font-medium ${colors.textPrimary}`}>Recipient</p>
                        <p className={`text-sm ${colors.textSecondary}`}>John Doe</p>
                        <p className={`text-sm ${colors.textSecondary}`}>+91 98765 43210</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.accent}/10`}>
                        <Clock size={20} className={colors.icon} />
                      </div>
                      <div>
                        <p className={`font-medium ${colors.textPrimary}`}>Delivery Time</p>
                        <p className={`text-sm ${colors.textSecondary}`}>Today, 6:00 PM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Pre-delivery Alert */}
                  {showPreDeliveryAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 rounded-lg p-3 ${colors.alert}`}
                    >
                      <p className="font-medium">Prepare for delivery!</p>
                      <p className="text-sm">Please keep your OTP ready for verification</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
