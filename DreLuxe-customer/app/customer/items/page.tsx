"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemSelector } from "@/components/item-selector"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/mobile-nav"
import { FloatingActionButton } from "@/components/floating-action-button"

export default function ItemsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [serviceType, setServiceType] = useState<string>("ironing")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

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

  useEffect(() => {
    // Get service type from URL query parameter
    const service = searchParams.get("service")
    if (service) {
      setServiceType(service)
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [searchParams])

  const handleBack = () => {
    router.back()
  }

  const handleProceed = () => {
    toast({
      title: "Items added to cart",
      description: "Proceeding to order confirmation",
    })
    router.push("/customer/order-confirmation")
  }

  return (
    <div className={`min-h-screen ${colors.background}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${colors.card} p-4 shadow-sm border-b ${colors.divider}`}>
        <div className="flex items-center justify-between">
          {showSearch ? (
            <div className="flex w-full items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(false)}
                className={`flex-shrink-0 ${colors.buttonOutline}`}
              >
                <ArrowLeft size={20} className={colors.textPrimary} />
              </Button>
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 ${colors.card} border-[#282828] ${colors.textPrimary}`}
                autoFocus
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className={`rounded-full ${colors.buttonOutline}`}
                >
                  <ArrowLeft size={20} className={colors.textPrimary} />
                </Button>
                <h1 className={`text-lg font-semibold ${colors.textPrimary}`}>Select Items</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(true)}
                  className={`rounded-full ${colors.buttonOutline}`}
                >
                  <Search size={20} className={colors.textPrimary} />
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className={`rounded-full ${colors.buttonOutline}`}>
                      <Filter size={20} className={colors.textPrimary} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className={`w-[80vw] sm:w-[350px] ${colors.card}`}>
                    <div className="py-6">
                      <h2 className={`text-lg font-semibold mb-4 ${colors.textPrimary}`}>Filter Items</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className={`text-sm font-medium mb-2 ${colors.textPrimary}`}>Price Range</h3>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Min"
                              type="number"
                              className={`w-24 ${colors.card} border-[#282828] ${colors.textPrimary}`}
                            />
                            <span className={colors.textPrimary}>to</span>
                            <Input
                              placeholder="Max"
                              type="number"
                              className={`w-24 ${colors.card} border-[#282828] ${colors.textPrimary}`}
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className={`text-sm font-medium mb-2 ${colors.textPrimary}`}>Categories</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="shirts" className="h-4 w-4 accent-[#1DB954]" />
                              <label htmlFor="shirts" className={colors.textPrimary}>
                                Shirts
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="pants" className="h-4 w-4 accent-[#1DB954]" />
                              <label htmlFor="pants" className={colors.textPrimary}>
                                Pants
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="sarees" className="h-4 w-4 accent-[#1DB954]" />
                              <label htmlFor="sarees" className={colors.textPrimary}>
                                Sarees
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="bedsheets" className="h-4 w-4 accent-[#1DB954]" />
                              <label htmlFor="bedsheets" className={colors.textPrimary}>
                                Bedsheets
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className={`text-sm font-medium mb-2 ${colors.textPrimary}`}>Sort By</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="radio" name="sort" id="price-low" className="h-4 w-4 accent-[#1DB954]" />
                              <label htmlFor="price-low" className={colors.textPrimary}>
                                Price: Low to High
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="radio" name="sort" id="price-high" className="h-4 w-4 accent-[#1DB954]" />
                              <label htmlFor="price-high" className={colors.textPrimary}>
                                Price: High to Low
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="radio" name="sort" id="popular" className="h-4 w-4 accent-[#1DB954]" />
                              <label htmlFor="popular" className={colors.textPrimary}>
                                Popularity
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" className={`flex-1 ${colors.buttonOutline}`}>
                            Reset
                          </Button>
                          <Button className={`flex-1 ${colors.button}`}>Apply</Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="px-4 py-4 pb-20">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 w-full animate-pulse rounded-lg bg-[#282828]"></div>
            <div className="h-96 w-full animate-pulse rounded-lg bg-[#282828]"></div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className={`mb-6 overflow-hidden border-[#282828] ${colors.card}`}>
              <CardContent className="p-4">
                <ItemSelector serviceType={serviceType} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleProceed} position="bottom-center" />
    </div>
  )
}
