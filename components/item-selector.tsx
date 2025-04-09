"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, RotateCw, ZoomIn, ZoomOut, Plus, Minus, ShoppingCart, Trash2, Search, X } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { SwipeToAction } from "@/components/swipe-to-action"
import { BottomSheet } from "@/components/bottom-sheet"
import { Input } from "@/components/ui/input"

interface Item {
  id: string
  name: string
  price: number | string
  image?: string
  category: "ironing" | "washing" | "drycleaning"
  quantity?: number
}

export function ItemSelector({ serviceType = "ironing" }: { serviceType?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [cartItems, setCartItems] = useState<Item[]>([])
  const [activeCategory, setActiveCategory] = useState<string>(serviceType)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const { toast } = useToast()

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

  // Sample items based on the pricing table in the image
  const items: Item[] = [
    {
      id: "shirt-regular",
      name: "Shirt (Regular Ironing)",
      price: 10,
      category: "ironing",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "pants",
      name: "Pants/Trousers/Jeans",
      price: 10,
      category: "ironing",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "tshirts",
      name: "T-Shirts",
      price: 10,
      category: "ironing",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "saree-cotton",
      name: "Saree (Cotton)",
      price: 100,
      category: "ironing",
      image: "https://images.unsplash.com/photo-1610189844804-2c1d9628b552?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "saree-silk",
      name: "Saree (Silk)",
      price: 200,
      category: "ironing",
      image: "https://images.unsplash.com/photo-1610189844804-2c1d9628b552?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "white-shirt-starch",
      name: "White Shirt with Starch",
      price: 45,
      category: "ironing",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "salwar-2pcs",
      name: "Salwar (2 Pcs)",
      price: "100-120",
      category: "ironing",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "salwar-3pcs",
      name: "Salwar (3 Pcs)",
      price: "120-180",
      category: "ironing",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "jacket",
      name: "Jacket (Woolen/Leather)",
      price: "150-700",
      category: "drycleaning",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "kurtha-pyjama",
      name: "Kurtha & Pyjama",
      price: "80-150",
      category: "ironing",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "handkerchiefs",
      name: "Handkerchiefs",
      price: "5-40",
      category: "washing",
      image: "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "socks",
      name: "Socks",
      price: "5-40",
      category: "washing",
      image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "caps",
      name: "Caps",
      price: "5-40",
      category: "washing",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=200&auto=format&fit=crop",
    },
    // Additional items for washing category
    {
      id: "shirt-wash",
      name: "Shirt (Washing)",
      price: 15,
      category: "washing",
      image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "pants-wash",
      name: "Pants/Jeans (Washing)",
      price: 20,
      category: "washing",
      image: "https://images.unsplash.com/photo-1604176424472-9d7122b0b9c4?q=80&w=200&auto=format&fit=crop",
    },
    // Additional items for dry cleaning category
    {
      id: "suit",
      name: "Suit (2 Piece)",
      price: 350,
      category: "drycleaning",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "coat",
      name: "Coat",
      price: 250,
      category: "drycleaning",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop",
    },
  ]

  // Set active category based on serviceType prop
  useEffect(() => {
    setActiveCategory(serviceType)
  }, [serviceType])

  // Handle item selection
  const handleSelectItem = (item: Item) => {
    setSelectedItem(item)
    setRotation(0)
    setZoom(1)

    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  // Handle rotation
  const handleRotate = () => {
    setRotation((prev) => (prev + 20) % 360)
  }

  // Handle zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  // Handle camera upload
  const handleCameraUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true)

      // Simulate upload and AI detection
      setTimeout(() => {
        setIsUploading(false)
        setIsDetecting(true)

        // Simulate AI detection
        setTimeout(() => {
          setIsDetecting(false)
          // Find an item from the active category
          const categoryItems = items.filter((item) => item.category === activeCategory)
          if (categoryItems.length > 0) {
            handleSelectItem(categoryItems[0]) // Select first item from active category
          } else {
            handleSelectItem(items[0]) // Fallback to first item
          }
        }, 2000)
      }, 1500)
    }
  }

  // Add item to cart
  const addToCart = (item: Item) => {
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id)

    if (existingItemIndex !== -1) {
      // Item already exists in cart, update quantity
      const updatedCart = [...cartItems]
      const currentQuantity = updatedCart[existingItemIndex].quantity || 0
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: currentQuantity + 1,
      }
      setCartItems(updatedCart)
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...item, quantity: 1 }])
    }

    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    toast({
      title: "Item added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    })
  }

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const existingItemIndex = cartItems.findIndex((item) => item.id === itemId)

    if (existingItemIndex !== -1) {
      const updatedCart = [...cartItems]
      const currentQuantity = updatedCart[existingItemIndex].quantity || 0

      if (currentQuantity > 1) {
        // Reduce quantity if more than 1
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: currentQuantity - 1,
        }
        setCartItems(updatedCart)
      } else {
        // Remove item if quantity is 1
        setCartItems(cartItems.filter((item) => item.id !== itemId))
      }

      toast({
        title: "Item removed",
        description: `${cartItems[existingItemIndex].name} has been removed from your cart.`,
        duration: 2000,
      })
    }
  }

  // Delete item from cart
  const deleteFromCart = (itemId: string) => {
    const existingItemIndex = cartItems.findIndex((item) => item.id === itemId)

    if (existingItemIndex !== -1) {
      setCartItems(cartItems.filter((item) => item.id !== itemId))

      toast({
        title: "Item removed",
        description: `Item has been removed from your cart.`,
        duration: 2000,
      })
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = item.quantity || 0
      const itemPrice = typeof item.price === "string" ? Number.parseInt(item.price.split("-")[0]) : item.price
      return total + itemPrice * quantity
    }, 0)
  }

  // Filter items by category and search query
  const filteredItems = items
    .filter((item) => item.category === activeCategory)
    .filter((item) => searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="w-full">
      {/* Search and Category Filters */}
      <div className="mb-4 space-y-4">
        {showSearch ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative"
          >
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pr-10 ${colors.card} border-[#282828] ${colors.textPrimary}`}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-0 top-0 ${colors.buttonOutline}`}
              onClick={() => {
                setShowSearch(false)
                setSearchQuery("")
              }}
            >
              <X size={18} className={colors.textPrimary} />
            </Button>
          </motion.div>
        ) : (
          <div className="flex justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge
                className={`cursor-pointer text-sm px-4 py-2 transition-all ${
                  activeCategory === "ironing" 
                    ? colors.accent 
                    : "bg-[#282828] text-[#ffffff] hover:bg-[#333333]"
                }`}
                onClick={() => setActiveCategory("ironing")}
              >
                Ironing
              </Badge>
              <Badge
                className={`cursor-pointer text-sm px-4 py-2 transition-all ${
                  activeCategory === "washing" 
                    ? colors.accent 
                    : "bg-[#282828] text-[#ffffff] hover:bg-[#333333]"
                }`}
                onClick={() => setActiveCategory("washing")}
              >
                Washing
              </Badge>
              <Badge
                className={`cursor-pointer text-sm px-4 py-2 transition-all ${
                  activeCategory === "drycleaning" 
                    ? colors.accent 
                    : "bg-[#282828] text-[#ffffff] hover:bg-[#333333]"
                }`}
                onClick={() => setActiveCategory("drycleaning")}
              >
                Dry Cleaning
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSearch(true)} 
              className={`rounded-full ${colors.buttonOutline}`}
            >
              <Search size={18} className={colors.textPrimary} />
            </Button>
          </div>
        )}
      </div>

      {/* 3D Item Viewer */}
      <AnimatePresence mode="wait">
        {selectedItem ? (
          <motion.div
            className="mb-4"
            key="selected-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-[#282828] overflow-hidden ${colors.card}`}>
              <CardContent className="flex flex-col items-center p-4">
                <div className="relative mb-4 h-64 w-64">
                  <motion.div
                    animate={{ rotate: rotation, scale: zoom }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="h-full w-full"
                    drag
                    dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                    dragElastic={0.1}
                    whileTap={{ cursor: "grabbing" }}
                  >
                    <Image
                      src={selectedItem.image || "/placeholder.svg"}
                      alt={selectedItem.name}
                      width={256}
                      height={256}
                      className="h-full w-full object-contain"
                    />
                  </motion.div>
                </div>

                <div className="flex w-full justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRotate}
                    className={colors.buttonOutline}
                  >
                    <RotateCw size={18} className={colors.textPrimary} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className={colors.buttonOutline}
                  >
                    <ZoomIn size={18} className={colors.textPrimary} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className={colors.buttonOutline}
                  >
                    <ZoomOut size={18} className={colors.textPrimary} />
                  </Button>
                </div>

                <motion.div
                  className="mt-4 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className={`text-lg font-medium ${colors.textPrimary}`}>{selectedItem.name}</h3>
                  <p className={colors.textSecondary}>₹{selectedItem.price}</p>
                  <div className="mt-4 flex justify-between">
                    <Button
                      variant="outline"
                      className={`flex items-center gap-2 ${colors.buttonOutline}`}
                      onClick={() => addToCart(selectedItem)}
                    >
                      <Plus size={18} className={colors.textPrimary} />
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="mb-4"
            key="upload-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-[#282828] ${colors.card}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#282828] border-t-[#1DB954]"></div>
                    <p className={colors.textPrimary}>Uploading image...</p>
                  </div>
                ) : isDetecting ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-[#1DB954]/20">
                      <div className="flex h-full w-full items-center justify-center">
                        <Camera size={32} className="text-[#1DB954]" />
                      </div>
                    </div>
                    <p className={colors.textPrimary}>Detecting item...</p>
                  </div>
                ) : (
                  <>
                    <p className={`mb-4 text-center ${colors.textSecondary}`}>
                      Select an item from the catalog or upload a photo
                    </p>
                    <Button
                      variant="outline"
                      className={`flex items-center gap-2 ${colors.buttonOutline}`}
                      onClick={handleCameraUpload}
                    >
                      <Camera size={18} className={colors.textPrimary} />
                      Upload Photo
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      <div className="mb-4">
        <h3 className={`mb-2 text-lg font-semibold ${colors.textPrimary}`}>Available Items</h3>
        <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <SwipeToAction
                  actions={[
                    {
                      icon: <Plus size={20} className="text-white" />,
                      color: "#1DB954",
                      onClick: () => addToCart(item),
                    },
                  ]}
                >
                  <div
                    className={`flex cursor-pointer items-center justify-between rounded-lg border border-[#282828] p-3 transition-colors ${colors.card} ${colors.cardHover}`}
                    onClick={() => handleSelectItem(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-md bg-[#282828]">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className={colors.textPrimary}>{item.name}</h4>
                        <p className={`text-sm ${colors.textSecondary}`}>₹{item.price}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`hover:bg-[#1DB954]/10 hover:text-[#1DB954] ${colors.buttonOutline}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(item)
                      }}
                    >
                      <Plus size={18} className={colors.textPrimary} />
                    </Button>
                  </div>
                </SwipeToAction>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <Search size={48} className={`mb-4 ${colors.textSecondary}/50`} />
              <p className={colors.textSecondary}>No items found matching "{searchQuery}"</p>
              <Button
                variant="outline"
                className={`mt-4 ${colors.buttonOutline}`}
                onClick={() => {
                  setSearchQuery("")
                  setShowSearch(false)
                }}
              >
                Clear Search
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Cart Button */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <Button
              className={`w-full ${colors.button}`}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={18} className="mr-2" />
              View Cart ({cartItems.length} items) - ₹{calculateTotal()}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Bottom Sheet */}
      <BottomSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Your Cart" snapPoints={[0.6, 0.9]}>
        <div className="space-y-4">
          {cartItems.length > 0 ? (
            <>
              <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                {cartItems.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <SwipeToAction
                      actions={[
                        {
                          icon: <Trash2 size={20} className="text-white" />,
                          color: "#ef4444",
                          onClick: () => deleteFromCart(item.id),
                        },
                      ]}
                    >
                      <div className={`flex items-center justify-between rounded-lg border border-[#282828] p-3 ${colors.card}`}>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-md bg-[#282828]">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className={colors.textPrimary}>{item.name}</h4>
                            <p className={`text-sm ${colors.textSecondary}`}>
                              ₹{item.price} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${colors.buttonOutline}`}
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus size={14} className={colors.textPrimary} />
                          </Button>
                          <span className={`w-6 text-center ${colors.textPrimary}`}>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${colors.buttonOutline}`}
                            onClick={() => addToCart(item)}
                          >
                            <Plus size={14} className={colors.textPrimary} />
                          </Button>
                        </div>
                      </div>
                    </SwipeToAction>
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-6 space-y-4">
                <div className={`rounded-lg bg-[#282828]/30 p-4`}>
                  <div className="flex justify-between mb-2">
                    <span className={colors.textSecondary}>Subtotal</span>
                    <span className={colors.textPrimary}>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={colors.textSecondary}>Delivery Fee</span>
                    <span className={colors.textPrimary}>₹40</span>
                  </div>
                  <div className={`flex justify-between font-medium text-lg pt-2 border-t border-[#333333]`}>
                    <span className={colors.textPrimary}>Total</span>
                    <span className={colors.textPrimary}>₹{calculateTotal() + 40}</span>
                  </div>
                </div>

                <Button className={`w-full ${colors.button}`}>Proceed to Checkout</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <ShoppingCart size={64} className={`mb-4 ${colors.textSecondary}/50`} />
              </motion.div>
              <h3 className={`text-xl font-medium mb-2 ${colors.textPrimary}`}>Your cart is empty</h3>
              <p className={`${colors.textSecondary} text-center mb-6`}>
                Add some items to get started with your laundry order
              </p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)} className={colors.buttonOutline}>
                Browse Items
              </Button>
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
}
}\
\
