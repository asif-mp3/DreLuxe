"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { ArrowLeft, Camera, Check, Edit2, Lock, Shield, User } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100")
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    dob: "1990-01-01",
  })
  const [biometricLogin, setBiometricLogin] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

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
    switch: "data-[state=checked]:bg-[#1DB954]",
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
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
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      })
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
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
            <h1 className={`text-lg font-semibold ${colors.textPrimary}`}>Profile</h1>
          </div>

          <Logo width={100} height={50} variant="dark" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* Profile Header */}
            <Card className={`mb-6 overflow-hidden border ${colors.divider}`}>
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r from-[#1DB954]/80 to-[#1DB954] p-6 ${colors.textPrimary}`}>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white">
                        <Image
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white ${colors.icon} hover:bg-gray-100`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera size={16} />
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-sm text-white/90">{profile.email}</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-1 text-xs ${colors.buttonOutline}`}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit2 size={14} />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>

                    {isEditing && (
                      <Button
                        size="sm"
                        className={`flex items-center gap-1 text-xs ${colors.button}`}
                        onClick={handleProfileUpdate}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Check size={14} />
                        )}
                        Save Changes
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className={`mb-6 border ${colors.divider}`}>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center gap-2">
                  <User size={18} className={colors.icon} />
                  <h2 className={`text-lg font-semibold ${colors.textPrimary}`}>Personal Information</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={colors.textPrimary}>
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className={colors.textPrimary}>
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className={colors.textPrimary}>
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob" className={colors.textPrimary}>
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={profile.dob}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`${colors.card} ${colors.textPrimary} border ${colors.divider}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className={`mb-6 border ${colors.divider}`}>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Shield size={18} className={colors.icon} />
                  <h2 className={`text-lg font-semibold ${colors.textPrimary}`}>Security & Privacy</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${colors.textPrimary}`}>Biometric Login</p>
                      <p className={`text-sm ${colors.textSecondary}`}>Use fingerprint or face recognition to login</p>
                    </div>
                    <Switch checked={biometricLogin} onCheckedChange={setBiometricLogin} className={colors.switch} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${colors.textPrimary}`}>Dark Mode</p>
                      <p className={`text-sm ${colors.textSecondary}`}>Switch between light and dark themes</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} className={colors.switch} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${colors.textPrimary}`}>Push Notifications</p>
                      <p className={`text-sm ${colors.textSecondary}`}>Receive updates about your orders</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} className={colors.switch} />
                  </div>

                  <Button
                    variant="outline"
                    className={`w-full flex items-center justify-center gap-2 ${colors.buttonOutline}`}
                    onClick={() => router.push("/customer/change-password")}
                  >
                    <Lock size={16} />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button variant="outline" className={`w-full ${colors.danger}`} onClick={() => router.push("/")}>
              Logout
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
