"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { Leaf } from "lucide-react"
import Image from "next/image"

export default function PreferencesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    fabricCare: "standard",
    avoidMixing: [] as string[],
    foldStyle: "standard",
    hangerType: "plastic",
    specialRequests: "",
  })

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

  // Handle fabric care selection
  const handleFabricCareChange = (value: string) => {
    setPreferences({ ...preferences, fabricCare: value })
  }

  // Handle avoid mixing selection
  const handleAvoidMixingChange = (value: string) => {
    setPreferences((prev) => {
      const current = [...prev.avoidMixing]

      if (current.includes(value)) {
        return { ...prev, avoidMixing: current.filter((item) => item !== value) }
      } else {
        return { ...prev, avoidMixing: [...current, value] }
      }
    })
  }

  // Handle fold style selection
  const handleFoldStyleChange = (value: string) => {
    setPreferences({ ...preferences, foldStyle: value })
  }

  // Handle hanger type selection
  const handleHangerTypeChange = (value: string) => {
    setPreferences({ ...preferences, hangerType: value })
  }

  // Handle special requests
  const handleSpecialRequestsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Limit to 100 characters
    if (e.target.value.length <= 100) {
      setPreferences({ ...preferences, specialRequests: e.target.value })
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Save preferences to localStorage for demo purposes
      localStorage.setItem("user_preferences", JSON.stringify(preferences))

      toast({
        title: "Preferences saved",
        description: "Your laundry preferences have been saved",
      })

      // Navigate to payment setup
      router.push("/customer/payment")
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
          <h1 className={`mb-6 text-center text-2xl font-bold ${colors.textPrimary}`}>Laundry Preferences</h1>

          <div className="space-y-6">
            {/* Fabric Care */}
            <div className="space-y-3">
              <h2 className={`text-lg font-medium ${colors.textPrimary}`}>Fabric Care</h2>

              <RadioGroup
                value={preferences.fabricCare}
                onValueChange={handleFabricCareChange}
                className="grid grid-cols-3 gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]/10`}>
                    <Image
                      src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=200&auto=format&fit=crop"
                      alt="Cotton"
                      width={40}
                      height={40}
                      className="rounded-full object-cover h-12 w-12"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cotton" id="cotton" className="border-[#1DB954]" />
                    <Label htmlFor="cotton" className={colors.textPrimary}>
                      Cotton
                    </Label>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]/10`}>
                    <Image
                      src="https://images.unsplash.com/photo-1589036555904-e518339f8ebc?q=80&w=200&auto=format&fit=crop"
                      alt="Silk"
                      width={40}
                      height={40}
                      className="rounded-full object-cover h-12 w-12"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="silk" id="silk" className="border-[#1DB954]" />
                    <Label htmlFor="silk" className={colors.textPrimary}>
                      Silk
                    </Label>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]/10`}>
                    <Image
                      src="https://images.unsplash.com/photo-1603251579711-8d85fe6bea09?q=80&w=200&auto=format&fit=crop"
                      alt="Wool"
                      width={40}
                      height={40}
                      className="rounded-full object-cover h-12 w-12"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wool" id="wool" className="border-[#1DB954]" />
                    <Label htmlFor="wool" className={colors.textPrimary}>
                      Wool
                    </Label>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]/10`}>
                    <Image
                      src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=200&auto=format&fit=crop"
                      alt="Standard"
                      width={40}
                      height={40}
                      className="rounded-full object-cover h-12 w-12"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" className="border-[#1DB954]" />
                    <Label htmlFor="standard" className={colors.textPrimary}>
                      Standard
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Avoid Mixing */}
            <div className="space-y-3">
              <h2 className={`text-lg font-medium ${colors.textPrimary}`}>Avoid Mixing With</h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="blood"
                    checked={preferences.avoidMixing.includes("blood")}
                    onCheckedChange={() => handleAvoidMixingChange("blood")}
                    className="border-[#535353] data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954]"
                  />
                  <Label htmlFor="blood" className={colors.textPrimary}>
                    Blood Stains
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="baby"
                    checked={preferences.avoidMixing.includes("baby")}
                    onCheckedChange={() => handleAvoidMixingChange("baby")}
                    className="border-[#535353] data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954]"
                  />
                  <Label htmlFor="baby" className={colors.textPrimary}>
                    Baby Clothes
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pet"
                    checked={preferences.avoidMixing.includes("pet")}
                    onCheckedChange={() => handleAvoidMixingChange("pet")}
                    className="border-[#535353] data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954]"
                  />
                  <Label htmlFor="pet" className={colors.textPrimary}>
                    Pet Hair
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dye"
                    checked={preferences.avoidMixing.includes("dye")}
                    onCheckedChange={() => handleAvoidMixingChange("dye")}
                    className="border-[#535353] data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954]"
                  />
                  <Label htmlFor="dye" className={colors.textPrimary}>
                    Color Bleeding
                  </Label>
                </div>
              </div>
            </div>

            {/* Fold Styles */}
            <div className="space-y-3">
              <h2 className={`text-lg font-medium ${colors.textPrimary}`}>Fold Style</h2>

              <RadioGroup
                value={preferences.foldStyle}
                onValueChange={handleFoldStyleChange}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-2 h-24 w-full overflow-hidden rounded-lg border border-[#282828]">
                    <Image
                      src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=200&auto=format&fit=crop"
                      alt="Standard Fold"
                      width={160}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="fold-standard" className="border-[#1DB954]" />
                    <Label htmlFor="fold-standard" className={colors.textPrimary}>
                      Standard
                    </Label>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-2 h-24 w-full overflow-hidden rounded-lg border border-[#282828]">
                    <Image
                      src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=200&auto=format&fit=crop"
                      alt="Military Fold"
                      width={160}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="military" id="fold-military" className="border-[#1DB954]" />
                    <Label htmlFor="fold-military" className={colors.textPrimary}>
                      Military
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Hanger Type */}
            <div className="space-y-3">
              <h2 className={`text-lg font-medium ${colors.textPrimary}`}>Hanger Type</h2>

              <RadioGroup
                value={preferences.hangerType}
                onValueChange={handleHangerTypeChange}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-2 h-24 w-full overflow-hidden rounded-lg border border-[#282828]">
                    <Image
                      src="https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=200&auto=format&fit=crop"
                      alt="Plastic Hanger"
                      width={160}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="plastic" id="hanger-plastic" className="border-[#1DB954]" />
                    <Label htmlFor="hanger-plastic" className={colors.textPrimary}>
                      Plastic
                    </Label>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-2 h-24 w-full overflow-hidden rounded-lg border border-[#282828]">
                    <div className="relative h-full w-full">
                      <Image
                        src="https://images.unsplash.com/photo-1628602040839-6d0a6e0e3517?q=80&w=200&auto=format&fit=crop"
                        alt="Wooden Hanger"
                        width={160}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 rounded-full bg-[#1DB954]/20 p-1">
                        <Leaf size={16} className="text-[#1DB954]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wooden" id="hanger-wooden" className="border-[#1DB954]" />
                    <Label htmlFor="hanger-wooden" className={colors.textPrimary}>
                      Wooden
                    </Label>
                  </div>
                  <span className="text-xs text-[#1DB954]">Eco-friendly</span>
                </div>
              </RadioGroup>
            </div>

            {/* Special Requests */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="special-requests" className={colors.textPrimary}>
                  Special Requests
                </Label>
                <span className={`text-xs ${colors.textSecondary}`}>{preferences.specialRequests.length}/100</span>
              </div>

              <Textarea
                id="special-requests"
                placeholder="No fabric softener, extra starch, etc."
                value={preferences.specialRequests}
                onChange={handleSpecialRequestsChange}
                className={`resize-none ${colors.card} border-[#282828] ${colors.textPrimary} focus:border-[#1DB954] focus:ring-[#1DB954]`}
                rows={3}
              />
            </div>

            <Button className={`w-full ${colors.button}`} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
