"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Camera, Upload, Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import Cropper from "react-easy-crop"
import type { Point, Area } from "react-easy-crop/types"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile picture state
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)

  // Format phone number as user types
  useEffect(() => {
    if (phone) {
      // Remove all non-digits
      const digitsOnly = phone.replace(/\D/g, "")

      // Format as +91 XXX XXX XXXX
      if (digitsOnly.length <= 10) {
        let formatted = digitsOnly
        if (digitsOnly.length > 3 && digitsOnly.length <= 6) {
          formatted = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`
        } else if (digitsOnly.length > 6) {
          formatted = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`
        }

        if (formatted !== phone) {
          setPhone(formatted)
        }
      }

      // Validate phone number (simple 10-digit check)
      setIsPhoneValid(digitsOnly.length === 10)
    }
  }, [phone])

  // Validate email as user types
  useEffect(() => {
    if (email) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setIsEmailValid(emailRegex.test(email))

      // Check for disposable email domains (simplified)
      const disposableDomains = ["mailinator.com", "tempmail.com", "fakeinbox.com", "guerrillamail.com"]
      const domain = email.split("@")[1]

      if (domain && disposableDomains.includes(domain.toLowerCase())) {
        setIsEmailValid(false)
        toast({
          title: "Disposable email detected",
          description: "Please use a permanent email address",
          variant: "destructive",
        })
      }
    }
  }, [email, toast])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setIsCropping(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const createCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return null

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      const img = new Image()
      img.src = image

      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Set canvas dimensions to the cropped size
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      // Apply brightness and contrast
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`

      // Draw the cropped image
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      )

      // Convert to WebP if supported, otherwise JPEG
      const format = "image/webp"
      const quality = 0.8

      return canvas.toDataURL(format, quality)
    } catch (error) {
      console.error("Error creating cropped image:", error)
      return null
    }
  }

  const handleCropConfirm = async () => {
    const croppedImage = await createCroppedImage()
    if (croppedImage) {
      setImage(croppedImage)
      setIsCropping(false)

      // Show success message
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been set",
      })
    }
  }

  const handleSubmit = async () => {
    // Validate form
    if (!firstName || !lastName) {
      toast({
        title: "Missing information",
        description: "Please enter your first and last name",
        variant: "destructive",
      })
      return
    }

    if (!isEmailValid && !isPhoneValid) {
      toast({
        title: "Invalid contact information",
        description: "Please provide a valid email or phone number",
        variant: "destructive",
      })
      return
    }

    // Simulate successful registration
    toast({
      title: "Registration successful",
      description: "Proceeding to verification",
    })

    // Navigate to OTP verification
    setTimeout(() => {
      router.push("/customer/verify")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#F5F7FA] to-[#E8F4FD] p-4">
      <Toaster />

      <div className="mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <Logo width={150} height={75} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Create Your Account</h1>

          {/* Profile Picture Upload */}
          <div className="mb-6 flex flex-col items-center">
            <div
              className="relative mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-100"
              onClick={() => !isCropping && fileInputRef.current?.click()}
            >
              {image ? (
                isCropping ? (
                  <div className="h-full w-full">
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      cropShape="round"
                      showGrid={false}
                    />
                  </div>
                ) : (
                  <img src={image || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera size={32} className="text-gray-400" />
                </div>
              )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              {image ? "Change Photo" : "Upload Photo"}
            </Button>

            {/* Image Editing Controls */}
            {isCropping && (
              <div className="mt-4 w-full space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Zoom</Label>
                    <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
                  </div>
                  <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(value) => setZoom(value[0])} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Brightness</Label>
                    <span className="text-xs text-gray-500">{brightness}%</span>
                  </div>
                  <Slider
                    value={[brightness]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={(value) => setBrightness(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Contrast</Label>
                    <span className="text-xs text-gray-500">{contrast}%</span>
                  </div>
                  <Slider
                    value={[contrast]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={(value) => setContrast(value[0])}
                  />
                </div>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsCropping(false)}>
                    <X size={16} className="mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleCropConfirm}>
                    <Check size={16} className="mr-1" /> Apply
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Registration Form */}
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className={email && !isEmailValid ? "border-red-500" : ""}
              />
              {email && !isEmailValid && <p className="text-xs text-red-500">Please enter a valid email address</p>}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="XXX XXX XXXX"
                className={phone && !isPhoneValid ? "border-red-500" : ""}
                inputMode="numeric"
              />
              {phone && !isPhoneValid && (
                <p className="text-xs text-red-500">Please enter a valid 10-digit phone number</p>
              )}
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#4A90E2] to-[#2A70C2] hover:opacity-90"
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
