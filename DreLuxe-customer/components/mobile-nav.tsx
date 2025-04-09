"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Package, Calendar, User, Menu, LogOut, HelpCircle, Settings, CreditCard, MapPin } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const { toast } = useToast()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    { name: "Home", icon: Home, path: "/customer/dashboard" },
    { name: "Orders", icon: Package, path: "/customer/items" },
    { name: "Schedule", icon: Calendar, path: "/customer/tracking" },
    { name: "Profile", icon: User, path: "/customer/profile" },
  ]

  const isActive = (path: string) => {
    if (path === "/customer/dashboard" && pathname === "/customer/dashboard") return true
    if (path === "/customer/items" && pathname.includes("/customer/items")) return true
    if (path === "/customer/tracking" && pathname.includes("/customer/tracking")) return true
    if (path === "/customer/profile" && pathname.includes("/customer/profile")) return true
    return false
  }

  const handleLogout = () => {
    setIsSheetOpen(false)

    // Show confirmation toast
    toast({
      title: "Logging out...",
      description: "You'll be redirected to the login page",
    })

    // Simulate logout delay
    setTimeout(() => {
      logout()
      router.push("/customer")
    }, 1000)
  }

  return (
    <>
      <motion.nav
        className="mobile-nav"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`mobile-nav-item ${isActive(item.path) ? "active" : ""} haptic`}
            onClick={() => router.push(item.path)}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
            {isActive(item.path) && (
              <motion.div
                className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
                layoutId="nav-indicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="mobile-nav-item haptic">
              <Menu size={20} />
              <span>Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] sm:w-[350px] bg-card">
            <div className="flex flex-col h-full">
              <div className="py-6">
                <Logo animated />
              </div>
              <motion.div
                className="flex flex-col gap-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.07,
                    },
                  },
                }}
              >
                {[
                  { icon: HelpCircle, label: "Customer Support", path: "/customer/support" },
                  { icon: Package, label: "Order History", path: "/customer/order-details" },
                  { icon: Settings, label: "Preferences", path: "/customer/preferences" },
                  { icon: MapPin, label: "Saved Addresses", path: "/customer/address" },
                  { icon: CreditCard, label: "Payment Methods", path: "/customer/payment" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { x: 20, opacity: 0 },
                      visible: {
                        x: 0,
                        opacity: 1,
                        transition: { type: "spring", stiffness: 300, damping: 24 },
                      },
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="justify-start w-full"
                      onClick={() => {
                        setIsSheetOpen(false)
                        router.push(item.path)
                      }}
                    >
                      <item.icon size={18} className="mr-2" />
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-auto pt-6">
                <Button
                  variant="outline"
                  className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.nav>
    </>
  )
}
