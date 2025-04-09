"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Logo } from "@/components/logo"
import { ParticleBackground } from "@/components/particle-background"
import {
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  Truck,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Shirt,
  Droplets,
  Download,
  Shield,
} from "lucide-react"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [activeFeature, setActiveFeature] = useState(0)
  const { scrollY } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 3

  // Parallax effects
  const logoY = useTransform(scrollY, [0, 300], [0, -50])
  const titleY = useTransform(scrollY, [0, 300], [0, -30])
  const subtitleY = useTransform(scrollY, [0, 300], [0, -10])
  const buttonOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // Check online status and device capabilities
  useEffect(() => {
    // Check online status
    const handleOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Check for low-end device
    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
      setIsLowEndDevice(true)
    }

    // Rotate through features
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 5000)

    // Auto-rotate pages on mobile
    const pageInterval = setInterval(() => {
      if (isMobile) {
        setCurrentPage((prev) => (prev + 1) % totalPages)
      }
    }, 8000)

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
      clearInterval(featureInterval)
      clearInterval(pageInterval)
    }
  }, [isMobile])

  // Show offline toast if needed
  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "No internet connection",
        description: "Please check your connection and try again",
        action: (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        ),
      })
    }
  }, [isOnline, toast])

  // Navigate to login page
  const handleGetStarted = () => {
    router.push("/customer")
  }

  // Navigate to specific service page
  const handleServiceClick = (serviceType: string) => {
    router.push(`/customer/items?service=${serviceType}`)
  }

  // Scroll to section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Change page
  const changePage = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    } else {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    }
  }

  // Features data
  const features = [
    {
      icon: <Clock size={28} className="text-primary" />,
      title: "Time-Saving",
      description: "Save up to 5 hours weekly by outsourcing your laundry needs to our professional team.",
    },
    {
      icon: <Sparkles size={28} className="text-primary" />,
      title: "Premium Quality",
      description: "Expert cleaning techniques and premium detergents ensure your clothes look and feel their best.",
    },
    {
      icon: <Truck size={28} className="text-primary" />,
      title: "Doorstep Service",
      description: "Convenient pickup and delivery right to your doorstep, scheduled at your preferred time.",
    },
  ]

  // Testimonials data
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Working Professional",
      text: "DreLuxe has been a game-changer for me! With my busy schedule, I never had time for laundry. Now I get perfectly cleaned clothes delivered to my doorstep.",
      rating: 5,
    },
    {
      name: "Rahul Mehta",
      role: "Entrepreneur",
      text: "The quality of service is exceptional. My shirts have never looked better, and the convenience of scheduling pickups through the app is fantastic.",
      rating: 5,
    },
    {
      name: "Ananya Patel",
      role: "Student",
      text: "As a student living away from home, DreLuxe has made my life so much easier. Affordable, reliable, and the clothes smell amazing!",
      rating: 4,
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Particle background (disabled for low-end devices) */}
      {!isLowEndDevice && <ParticleBackground />}

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pt-16 text-center"
      >
        <motion.div style={{ y: logoY }}>
          <Logo width={180} height={90} animated />
        </motion.div>

        <motion.h1
          style={{ y: titleY }}
          className="mb-4 font-montserrat text-4xl font-bold text-foreground md:text-5xl mt-6 neon-glow"
        >
          Your One-Stop <span className="text-primary">Laundry</span> Solution
        </motion.h1>

        <motion.p style={{ y: subtitleY }} className="mb-8 max-w-md text-muted-foreground text-lg px-4">
          Experience premium laundry service with doorstep pickup and delivery. Save time and enjoy spotless clothes.
        </motion.p>

        <motion.div style={{ opacity: buttonOpacity }}>
          <Button
            className="px-6 py-6 text-lg font-medium bg-primary hover:bg-primary/90 btn-hover-effect"
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started <ArrowRight className="ml-2" size={20} />
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          className="absolute bottom-10 left-0 right-0 mx-auto flex flex-col items-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1.5, duration: 1 },
            y: { delay: 1.5, duration: 1.5, repeat: Number.POSITIVE_INFINITY },
          }}
          onClick={() => scrollToSection(featuresRef)}
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown size={24} />
        </motion.button>
      </section>

      {/* Features Section with Pagination for Mobile */}
      <section ref={featuresRef} className="relative z-10 px-4 py-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md"
        >
          <h2 className="mb-8 text-center font-montserrat text-2xl font-bold text-foreground md:text-3xl">
            Why Choose <span className="text-primary">DreLuxe</span>?
          </h2>

          {isMobile ? (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[200px]"
                >
                  {currentPage === 0 && (
                    <div className="space-y-4">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className={`rounded-xl ${index === activeFeature ? "bg-card" : "bg-card/50"} p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20`}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.5 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                              {feature.icon}
                            </div>
                            <div>
                              <h3 className="font-montserrat text-lg font-semibold">{feature.title}</h3>
                              <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {currentPage === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-center font-montserrat text-xl font-semibold mb-4">About Us</h3>
                      <p className="text-muted-foreground text-center">
                        DreLuxe was founded in 2022 with a mission to revolutionize the laundry experience in urban
                        India. We combine cutting-edge technology with eco-friendly cleaning practices to deliver
                        exceptional service.
                      </p>
                      <div className="flex justify-center mt-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="rounded-lg bg-card p-4">
                            <h4 className="text-2xl font-bold text-primary">10K+</h4>
                            <p className="text-sm text-muted-foreground">Happy Customers</p>
                          </div>
                          <div className="rounded-lg bg-card p-4">
                            <h4 className="text-2xl font-bold text-primary">25+</h4>
                            <p className="text-sm text-muted-foreground">Cities Served</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-center font-montserrat text-xl font-semibold mb-4">Customer Love</h3>
                      <div className="rounded-xl bg-card p-5 shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(testimonials[0].rating)].map((_, i) => (
                            <Star key={i} size={16} className="fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-sm italic mb-4">"{testimonials[0].text}"</p>
                        <div>
                          <p className="font-medium">{testimonials[0].name}</p>
                          <p className="text-xs text-muted-foreground">{testimonials[0].role}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Pagination controls */}
              <div className="flex justify-between items-center mt-6">
                <Button variant="ghost" size="icon" onClick={() => changePage("prev")} className="rounded-full">
                  <ChevronLeft size={20} />
                </Button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`h-2 w-2 rounded-full ${currentPage === i ? "bg-primary" : "bg-muted"}`}
                      onClick={() => setCurrentPage(i)}
                    />
                  ))}
                </div>

                <Button variant="ghost" size="icon" onClick={() => changePage("next")} className="rounded-full">
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`rounded-xl ${index === activeFeature ? "bg-card" : "bg-card/50"} p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-montserrat text-lg font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Marquee Grid for App Features - Improved for Mobile */}
      <section className="relative z-10 py-16 overflow-hidden bg-card">
        <div className="mx-auto max-w-md px-4">
          <h2 className="mb-8 text-center font-montserrat text-2xl font-bold text-foreground md:text-3xl">
            App <span className="text-primary">Features</span>
          </h2>

          <div className="relative">
            {/* First row - left to right */}
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{
                x: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              className="flex gap-3 mb-3"
            >
              <div className="flex-shrink-0 flex gap-3">
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Easy Ordering</h3>
                  <p className="text-xs text-muted-foreground">Order in just a few taps</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Truck size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Live Tracking</h3>
                  <p className="text-xs text-muted-foreground">Track your order in real-time</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Shirt size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Fabric Care</h3>
                  <p className="text-xs text-muted-foreground">Specialized care for all fabrics</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Clock size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Scheduled Pickups</h3>
                  <p className="text-xs text-muted-foreground">Set recurring laundry days</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Download size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Offline Mode</h3>
                  <p className="text-xs text-muted-foreground">Use app without internet</p>
                </div>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex-shrink-0 flex gap-3">
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Easy Ordering</h3>
                  <p className="text-xs text-muted-foreground">Order in just a few taps</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Truck size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Live Tracking</h3>
                  <p className="text-xs text-muted-foreground">Track your order in real-time</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Shirt size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Fabric Care</h3>
                  <p className="text-xs text-muted-foreground">Specialized care for all fabrics</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Clock size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Scheduled Pickups</h3>
                  <p className="text-xs text-muted-foreground">Set recurring laundry days</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Download size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Offline Mode</h3>
                  <p className="text-xs text-muted-foreground">Use app without internet</p>
                </div>
              </div>
            </motion.div>

            {/* Second row - right to left */}
            <motion.div
              animate={{ x: [-1200, 0] }}
              transition={{
                x: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 flex gap-3">
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Zap size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Express Service</h3>
                  <p className="text-xs text-muted-foreground">Same-day delivery option</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Sparkles size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Premium Quality</h3>
                  <p className="text-xs text-muted-foreground">Exceptional cleaning results</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Shield size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Secure Payments</h3>
                  <p className="text-xs text-muted-foreground">Multiple payment options</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Star size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Loyalty Rewards</h3>
                  <p className="text-xs text-muted-foreground">Earn points with every order</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Check size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Quality Guarantee</h3>
                  <p className="text-xs text-muted-foreground">100% satisfaction assured</p>
                </div>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex-shrink-0 flex gap-3">
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Zap size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Express Service</h3>
                  <p className="text-xs text-muted-foreground">Same-day delivery option</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Sparkles size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Premium Quality</h3>
                  <p className="text-xs text-muted-foreground">Exceptional cleaning results</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Shield size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Secure Payments</h3>
                  <p className="text-xs text-muted-foreground">Multiple payment options</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Star size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Loyalty Rewards</h3>
                  <p className="text-xs text-muted-foreground">Earn points with every order</p>
                </div>
                <div className="w-36 h-36 rounded-xl bg-background p-3 flex flex-col items-center justify-center text-center">
                  <Check size={28} className="text-primary mb-2" />
                  <h3 className="font-medium text-sm">Quality Guarantee</h3>
                  <p className="text-xs text-muted-foreground">100% satisfaction assured</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Improved */}
      <section ref={howItWorksRef} className="relative z-10 px-4 py-16 bg-background">
        <div className="mx-auto max-w-md">
          <h2 className="mb-12 text-center font-montserrat text-2xl font-bold text-foreground md:text-3xl">
            How It <span className="text-primary">Works</span>
          </h2>

          <div className="relative">
            {/* Vertical line connecting steps */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/30" />

            {/* Steps */}
            <div className="space-y-16">
              {/* Step 1 */}
              <motion.div
                className="flex items-start gap-4 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                      "0 0 0 10px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span className="text-lg font-bold">1</span>
                </motion.div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold">Schedule Pickup</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Book a convenient time for us to collect your laundry
                  </p>
                  <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={14} className="text-primary" />
                      <span>Choose from flexible time slots that fit your schedule</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="flex items-start gap-4 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                      "0 0 0 10px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                >
                  <span className="text-lg font-bold">2</span>
                </motion.div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold">Professional Cleaning</h3>
                  <p className="text-muted-foreground text-sm mb-3">Our experts clean and care for your clothes</p>
                  <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Droplets size={14} className="text-primary" />
                      <span>Advanced cleaning techniques for all fabric types</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="flex items-start gap-4 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                      "0 0 0 10px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                >
                  <span className="text-lg font-bold">3</span>
                </motion.div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold">Quality Check</h3>
                  <p className="text-muted-foreground text-sm mb-3">Thorough inspection ensures perfect results</p>
                  <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check size={14} className="text-primary" />
                      <span>Multi-point quality inspection before delivery</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                className="flex items-start gap-4 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                      "0 0 0 10px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                >
                  <span className="text-lg font-bold">4</span>
                </motion.div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold">Doorstep Delivery</h3>
                  <p className="text-muted-foreground text-sm mb-3">Clean clothes delivered at your preferred time</p>
                  <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck size={14} className="text-primary" />
                      <span>Track your delivery in real-time through our app</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative z-10 px-4 py-16 bg-card">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-center font-montserrat text-2xl font-bold text-foreground md:text-3xl">
            Our <span className="text-primary">Services</span>
          </h2>

          <div className="snap-container pb-4">
            {/* Service 1 - Ironing */}
            <motion.div
              className="snap-item w-[85vw] max-w-[300px] mr-4 overflow-hidden rounded-xl bg-background shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-muted overflow-hidden">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }}>
                  <Image
                    src="/placeholder.svg?height=160&width=300"
                    alt="Ironing Service"
                    width={300}
                    height={160}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 font-montserrat text-lg font-semibold">Ironing Service</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Professional ironing service to make your clothes look crisp and presentable.
                </p>
                <ul className="mb-4 space-y-2">
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-primary" />
                    <span className="text-xs">Expert pressing techniques</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 btn-hover-effect"
                  onClick={() => handleServiceClick("ironing")}
                >
                  Select Items
                </Button>
              </div>
            </motion.div>

            {/* Service 2 - Washing */}
            <motion.div
              className="snap-item w-[85vw] max-w-[300px] mr-4 overflow-hidden rounded-xl bg-background shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-muted overflow-hidden">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }}>
                  <Image
                    src="/placeholder.svg?height=160&width=300"
                    alt="Washing Service"
                    width={300}
                    height={160}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 font-montserrat text-lg font-semibold">Washing Service</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Premium washing service with high-quality detergents for all types of fabrics.
                </p>
                <ul className="mb-4 space-y-2">
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-primary" />
                    <span className="text-xs">Stain removal expertise</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 btn-hover-effect"
                  onClick={() => handleServiceClick("washing")}
                >
                  Select Items
                </Button>
              </div>
            </motion.div>

            {/* Service 3 - Dry Cleaning */}
            <motion.div
              className="snap-item w-[85vw] max-w-[300px] overflow-hidden rounded-xl bg-background shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-muted overflow-hidden">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }}>
                  <Image
                    src="/placeholder.svg?height=160&width=300"
                    alt="Dry Cleaning Service"
                    width={300}
                    height={160}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 font-montserrat text-lg font-semibold">Dry Cleaning</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Professional dry cleaning for delicate fabrics and formal wear.
                </p>
                <ul className="mb-4 space-y-2">
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-primary" />
                    <span className="text-xs">Safe for delicate fabrics</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 btn-hover-effect"
                  onClick={() => handleServiceClick("drycleaning")}
                >
                  Select Items
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section - New */}
      <section className="relative z-10 px-4 py-16 bg-background">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-center font-montserrat text-2xl font-bold text-foreground md:text-3xl">
            Simple <span className="text-primary">Pricing</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="rounded-xl bg-card p-6 shadow-lg border border-primary/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Basic Plan</h3>
                  <p className="text-sm text-muted-foreground">Perfect for individuals</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹499<span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">Up to 20 items per month</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">48-hour turnaround</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">Free pickup and delivery</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">Basic stain removal</span>
                </li>
              </ul>

              <Button className="w-full bg-primary hover:bg-primary/90">Choose Plan</Button>
            </motion.div>

            <motion.div
              className="rounded-xl bg-card p-6 shadow-lg border border-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                Popular
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Premium Plan</h3>
                  <p className="text-sm text-muted-foreground">For families</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹999<span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">Up to 50 items per month</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">24-hour turnaround</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">Priority pickup and delivery</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">Advanced stain removal</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-primary" />
                  <span className="text-sm">Premium fabric care</span>
                </li>
              </ul>

              <Button className="w-full bg-primary hover:bg-primary/90">Choose Plan</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - New */}
      <section className="relative z-10 px-4 py-16 bg-card">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-center font-montserrat text-2xl font-bold text-foreground md:text-3xl">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-lg bg-background p-4 shadow-sm">
              <h3 className="font-semibold mb-2">How soon can I get my clothes back?</h3>
              <p className="text-sm text-muted-foreground">
                Standard service takes 48 hours, while our express service can deliver your clothes back in as little as
                24 hours.
              </p>
            </div>

            <div className="rounded-lg bg-background p-4 shadow-sm">
              <h3 className="font-semibold mb-2">What areas do you service?</h3>
              <p className="text-sm text-muted-foreground">
                We currently operate in 25+ major cities across India, including Mumbai, Delhi, Bangalore, and Chennai.
              </p>
            </div>

            <div className="rounded-lg bg-background p-4 shadow-sm">
              <h3 className="font-semibold mb-2">How do I schedule a pickup?</h3>
              <p className="text-sm text-muted-foreground">
                You can schedule a pickup through our mobile app or website. Choose a convenient time slot, and our
                driver will arrive at your doorstep.
              </p>
            </div>

            <div className="rounded-lg bg-background p-4 shadow-sm">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit/debit cards, UPI payments, and cash on delivery for your convenience.
              </p>
            </div>

            <div className="rounded-lg bg-background p-4 shadow-sm">
              <h3 className="font-semibold mb-2">What if I'm not satisfied with the service?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 100% satisfaction guarantee. If you're not happy with our service, we'll re-clean your items
                at no additional cost.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download App Section - Enhanced */}
      <section className="relative z-10 px-4 py-16 bg-background overflow-hidden">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-center font-montserrat text-2xl font-bold text-foreground md:text-3xl">
            Download Our <span className="text-primary">App</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <motion.div
              className="relative w-[200px] h-[400px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 rounded-3xl border-8 border-card overflow-hidden shadow-xl">
                <div className="h-full w-full bg-card">
                  <Image
                    src="/placeholder.svg?height=400&width=200"
                    alt="App Screenshot"
                    width={200}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            </motion.div>

            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold">Get the DreLuxe Experience</h3>
              <p className="text-muted-foreground">
                Download our app for a seamless laundry experience with real-time tracking and exclusive offers.
              </p>

              <ul className="space-y-2 my-4">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span className="text-sm">Real-time order tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span className="text-sm">Exclusive app-only discounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span className="text-sm">Schedule recurring pickups</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span className="text-sm">Manage all your orders in one place</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button className="flex items-center gap-2 bg-card hover:bg-card/80">
                  <Download size={18} />
                  <div className="flex flex-col items-start">
                    <span className="text-xs">Download on</span>
                    <span className="font-semibold">App Store</span>
                  </div>
                </Button>

                <Button className="flex items-center gap-2 bg-card hover:bg-card/80">
                  <Download size={18} />
                  <div className="flex flex-col items-start">
                    <span className="text-xs">Get it on</span>
                    <span className="font-semibold">Google Play</span>
                  </div>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel - New */}
      <section className="relative z-10 px-4 py-16 bg-gradient-to-b from-background to-card">
        <div className="mx-auto max-w-md">
          <h2 className="mb-8 text-center font-montserrat text-2xl font-bold text-foreground md:text-3xl">
            What Our <span className="text-primary">Customers</span> Say
          </h2>

          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: [-100, -1200] }}
              transition={{
                x: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
              className="flex gap-4"
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-80 rounded-xl bg-card p-6 shadow-md border border-primary/10"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-card px-4 py-8 text-foreground">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex flex-col items-center justify-between gap-6">
            <Logo width={150} height={75} />
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="text-sm hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                Services
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                Contact
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                FAQ
              </a>
            </div>
          </div>
          <div className="border-t border-muted pt-4 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} DreLuxe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
