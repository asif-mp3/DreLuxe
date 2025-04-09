"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { MapPin, Navigation, Wifi, WifiOff } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Mapbox to avoid SSR issues
const MapboxMap = dynamic(() => import("@/components/mapbox-map"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center">Loading map...</div>,
})

export default function AddressPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isGpsAvailable, setIsGpsAvailable] = useState(true)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    landmark: "",
  })

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
    warning: "text-[#FFA500]",
  }

  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)
    handleOnlineStatus()

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation && isOnline) {
      setIsLoading(true)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoading(false)
          reverseGeocode(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGpsAvailable(false)
          setIsLoading(false)
          toast({
            title: "GPS unavailable",
            description: "Using approximate location based on your IP address",
            variant: "warning",
          })
          // Set default coordinates for Mumbai
          setCoordinates({
            lat: 19.076,
            lng: 72.8777,
          })
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else if (!isOnline) {
      setIsGpsAvailable(false)
      // Set default coordinates for Mumbai
      setCoordinates({
        lat: 19.076,
        lng: 72.8777,
      })
    }
  }, [isOnline, toast])

  // Reverse geocode coordinates to address using Mapbox
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const mapboxToken = "pk.eyJ1Ijoic3JpMDAxIiwiYSI6ImNtOThjNDlpdTAxcTQybnF1YTU3eDZjdTkifQ.oe7EvHR_iF3eMrVPMsc8WA"
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`,
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const context = data.features[0].context || []
        const street = data.features[0].text || ""
        const city = context.find((c: any) => c.id.includes("place"))?.text || ""
        const state = context.find((c: any) => c.id.includes("region"))?.text || ""
        const postcode = context.find((c: any) => c.id.includes("postcode"))?.text || ""

        setAddress({
          street,
          city,
          state,
          zipCode: postcode,
          landmark: "",
        })
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
    }
  }

  // Handle map pin drag
  const handleMapDrag = (newCoordinates: { lat: number; lng: number }) => {
    setCoordinates(newCoordinates)
    reverseGeocode(newCoordinates.lat, newCoordinates.lng)
    toast({
      title: "Location updated",
      description: "Address details have been refreshed",
    })
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required address fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      localStorage.setItem("user_address", JSON.stringify({ ...address, coordinates }))

      // Update user setup status
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.isNewUser) {
        user.isNewUser = false
        localStorage.setItem("user", JSON.stringify(user))
      }

      toast({
        title: "Address saved",
        description: "Your delivery address has been saved",
      })
      router.push("/customer/preferences")
    }, 1500)
  }

  // Save address to localStorage for offline use
  const saveAddressOffline = () => {
    localStorage.setItem("user_address", JSON.stringify({ ...address, coordinates }))
    toast({
      title: "Address saved offline",
      description: "Your address will be synced when you're back online",
    })
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
          <h1 className={`mb-6 text-center text-2xl font-bold ${colors.textPrimary}`}>Set Your Address</h1>

          {/* Online/Offline Status */}
          <div className="mb-4 flex items-center justify-center">
            {isOnline ? (
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${colors.success}`}>
                <Wifi size={14} />
                <span>Online Mode</span>
              </div>
            ) : (
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${colors.warning}`}>
                <WifiOff size={14} />
                <span>Offline Mode</span>
              </div>
            )}
          </div>

          {/* Map */}
          <div className={`mb-6 overflow-hidden rounded-lg border ${colors.divider}`}>
            <div className="h-48 w-full">
              {isOnline ? (
                coordinates ? (
                  <MapboxMap
                    coordinates={coordinates}
                    onDrag={handleMapDrag}
                    mapboxToken="pk.eyJ1Ijoic3JpMDAxIiwiYSI6ImNtOThjNDlpdTAxcTQybnF1YTU3eDZjdTkifQ.oe7EvHR_iF3eMrVPMsc8WA"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className={colors.textSecondary}>Loading map...</p>
                  </div>
                )
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2">
                  <MapPin size={32} className={colors.textSecondary} />
                  <p className={`text-center text-sm ${colors.textSecondary}`}>Map unavailable in offline mode</p>
                </div>
              )}
            </div>
          </div>

          {/* Current Location Button */}
          {isOnline && (
            <Button
              variant="outline"
              className={`mb-6 flex w-full items-center justify-center gap-2 ${colors.buttonOutline}`}
              onClick={() => {
                setIsLoading(true)
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setCoordinates({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    })
                    reverseGeocode(position.coords.latitude, position.coords.longitude)
                    setIsLoading(false)
                  },
                  (error) => {
                    console.error("Error getting location:", error)
                    setIsGpsAvailable(false)
                    setIsLoading(false)
                  },
                )
              }}
              disabled={isLoading || !isGpsAvailable}
            >
              <Navigation size={16} />
              {isLoading ? "Getting Location..." : "Use Current Location"}
            </Button>
          )}

          {/* Address Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street" className={colors.textPrimary}>
                Street Address *
              </Label>
              <Input
                id="street"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="123 Main Street"
                className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className={colors.textPrimary}>
                  City *
                </Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Mumbai"
                  className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className={colors.textPrimary}>
                  State *
                </Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="Maharashtra"
                  className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className={colors.textPrimary}>
                ZIP Code *
              </Label>
              <Input
                id="zipCode"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                placeholder="400001"
                inputMode="numeric"
                className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark" className={colors.textPrimary}>
                Landmark (Optional)
              </Label>
              <Textarea
                id="landmark"
                value={address.landmark}
                onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                placeholder="Near the blue building, etc."
                rows={2}
                className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
              />
            </div>

            <Button className={`w-full ${colors.button}`} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Address"}
            </Button>

            {!isOnline && (
              <Button variant="outline" className={`w-full ${colors.buttonOutline}`} onClick={saveAddressOffline}>
                Save for Offline Use
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
