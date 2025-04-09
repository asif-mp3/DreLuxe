"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Calendar, ShoppingBag, User, Zap } from "lucide-react"
import { OrderTracker } from "@/components/order-tracker"
import { WeatherBanner } from "@/components/weather-banner"
import { MobileNav } from "@/components/mobile-nav"
import { FloatingActionButton } from "@/components/floating-action-button"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { BottomSheet } from "@/components/bottom-sheet"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { orderAPI } from "@/lib/api-service"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("home")
  const [hasActiveOrder, setHasActiveOrder] = useState(true)
  const [notifications, setNotifications] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("John")
  const [showWeatherBanner, setShowWeatherBanner] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeOrders, setActiveOrders] = useState<any[]>([])
  const [pastOrders, setPastOrders] = useState<any[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  const { user, logout } = useAuth()

  // Set greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours()
      let newGreeting = ""

      if (currentHour < 12) {
        newGreeting = "Good morning"
      } else if (currentHour < 18) {
        newGreeting = "Good afternoon"
      } else {
        newGreeting = "Good evening"
      }

      setGreeting(newGreeting)
    }

    updateGreeting()

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      updateGreeting()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getOrders()

        // Split orders into active and past
        const active = data.orders.filter((order: any) =>
          ["pickup", "washing", "drying", "delivery"].includes(order.status),
        )

        const past = data.orders.filter((order: any) => order.status === "completed")

        setActiveOrders(active)
        setPastOrders(past)

        // Set hasActiveOrder based on whether there are active orders
        setHasActiveOrder(active.length > 0)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  // Handle new order button click
  const handleNewOrder = () => {
    router.push("/customer/items")
  }

  // Handle notification click
  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    })
  }

  // Handle emergency service request
  const handleEmergencyService = () => {
    toast({
      title: "Priority Service Requested",
      description: "Looking for available drivers nearby...",
    })

    // Simulate finding drivers
    setTimeout(() => {
      toast({
        title: "Driver Found!",
        description: "Your priority pickup will arrive in 15 minutes",
      })
    }, 3000)
  }

  // Dismiss weather banner
  const dismissWeatherBanner = () => {
    setShowWeatherBanner(false)
  }

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Refreshed",
      description: "Your dashboard has been updated",
    })

    setRefreshing(false)
  }

  // Sample order data
  const activeOrder =
    activeOrders.length > 0
      ? activeOrders[0]
      : {
          id: "ORD-12345",
          status: "washing", // pickup, washing, drying, delivery, completed
          items: [
            { name: "Shirts", quantity: 3 },
            { name: "Pants", quantity: 2 },
            { name: "Jackets", quantity: 1 },
          ],
          pickupTime: "Today, 10:30 AM",
          deliveryTime: "Tomorrow, 6:00 PM",
          totalAmount: 320,
        }

  // Sample past orders
  const scheduledOrders = [
    {
      id: "SCH-1001",
      date: "Every Monday",
      time: "9:00 AM",
      items: "Regular Laundry",
    },
    {
      id: "SCH-1002",
      date: "First Saturday of Month",
      time: "10:00 AM",
      items: "Bedsheets & Curtains",
    },
  ]

  // FAB actions
  const fabActions = [
    {
      icon: <ShoppingBag size={18} />,
      label: "New Order",
      onClick: handleNewOrder,
      color: "bg-primary",
    },
    {
      icon: <Zap size={18} />,
      label: "Priority Service",
      onClick: handleEmergencyService,
      color: "bg-amber-500",
    },
    {
      icon: <Calendar size={18} />,
      label: "Schedule Pickup",
      onClick: () => setIsSheetOpen(true),
      color: "bg-blue-500",
    },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute requireSetup={true}>
      <div className="flex min-h-screen flex-col bg-background">
        <PullToRefresh onRefresh={handleRefresh}>
          {/* Header */}
          <header className="sticky-header px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {greeting}, {user?.name || userName}!
                </h1>
                <p className="text-xs text-muted-foreground">
                  {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative rounded-full" onClick={handleNotificationClick}>
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {notifications}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => router.push("/customer/profile")}
                >
                  <User size={20} />
                </Button>
              </div>
            </div>
          </header>

          {/* Weather Alert Banner */}
          {showWeatherBanner && <WeatherBanner onDismiss={dismissWeatherBanner} />}

          {/* Main Content */}
          <main className="flex-1 px-4 pb-20">
            {isLoading ? (
              <div className="space-y-4 pt-4">
                <div className="h-40 animate-pulse rounded-xl bg-muted"></div>
                <div className="h-20 animate-pulse rounded-xl bg-muted"></div>
                <div className="h-60 animate-pulse rounded-xl bg-muted"></div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* Active Order Card */}
                {hasActiveOrder && (
                  <Card className="mb-4 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-primary/80 to-primary p-4 text-primary-foreground">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold">Active Order</h2>
                          <span className="rounded-full bg-white bg-opacity-20 px-2 py-1 text-xs">
                            {activeOrder.id}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-primary-foreground text-opacity-90">
                          Estimated delivery: {activeOrder.deliveryTime}
                        </p>
                      </div>

                      <div className="p-4">
                        <OrderTracker status={activeOrder.status} />

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Items:</span>
                            <span className="font-medium">
                              {activeOrder.items.map((item: any) => `${item.quantity} ${item.name}`).join(", ")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Pickup:</span>
                            <span className="font-medium">{activeOrder.pickupTime}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-medium">₹{activeOrder.totalAmount}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 text-sm border-primary/20 hover:bg-primary/10"
                            onClick={() => router.push("/customer/order-details")}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 text-sm border-primary/20 hover:bg-primary/10"
                            onClick={() => router.push("/customer/tracking")}
                          >
                            Track Order
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Orders */}
                {pastOrders.length > 0 && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
                      <div className="space-y-3">
                        {pastOrders.slice(0, 3).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between rounded-lg border border-primary/10 p-3"
                          >
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{order.totalAmount}</p>
                              <p className="text-xs text-green-500">Completed</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        className="mt-4 w-full border-primary/20"
                        onClick={() => router.push("/customer/orders")}
                      >
                        View All Orders
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-4">
                    <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="flex h-auto flex-col items-center justify-center gap-2 border-primary/20 py-4"
                        onClick={handleNewOrder}
                      >
                        <ShoppingBag size={24} className="text-primary" />
                        <span>New Order</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex h-auto flex-col items-center justify-center gap-2 border-primary/20 py-4"
                        onClick={() => router.push("/customer/profile")}
                      >
                        <User size={24} className="text-primary" />
                        <span>My Profile</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex h-auto flex-col items-center justify-center gap-2 border-primary/20 py-4"
                        onClick={() => router.push("/customer/support")}
                      >
                        <Bell size={24} className="text-primary" />
                        <span>Support</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex h-auto flex-col items-center justify-center gap-2 border-primary/20 py-4"
                        onClick={() => setIsSheetOpen(true)}
                      >
                        <Calendar size={24} className="text-primary" />
                        <span>Schedule</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </main>
        </PullToRefresh>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Floating Action Button */}
        <FloatingActionButton actions={fabActions} />

        {/* Schedule Pickup Bottom Sheet */}
        <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Schedule Pickup">
          <div className="space-y-4 p-2">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                Today
              </Button>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                Tomorrow
              </Button>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                Custom
              </Button>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium">Scheduled Pickups</h3>
              <div className="space-y-2">
                {scheduledOrders.map((order) => (
                  <div key={order.id} className="rounded-lg border border-primary/10 p-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{order.date}</p>
                      <p className="text-sm">{order.time}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.items}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-primary">Schedule New Pickup</Button>
          </div>
        </BottomSheet>
      </div>
    </ProtectedRoute>
  )
}
