"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, CheckCircle } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshComplete, setRefreshComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const threshold = 80 // Distance needed to trigger refresh

  const handleTouchStart = (e: TouchEvent) => {
    // Only enable pull to refresh when at the top of the page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling) return

    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current

    // Only allow pulling down
    if (diff > 0) {
      // Apply resistance to make it harder to pull
      const resistance = 0.4
      setPullDistance(diff * resistance)

      // Prevent default scrolling behavior
      e.preventDefault()
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling) return

    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true)

      try {
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }

        await onRefresh()

        // Show success animation briefly
        setRefreshComplete(true)
        setTimeout(() => {
          setRefreshComplete(false)
          setPullDistance(0)
          setIsRefreshing(false)
          setIsPulling(false)
        }, 1000)
      } catch (error) {
        console.error("Refresh failed:", error)
        setIsRefreshing(false)
        setPullDistance(0)
        setIsPulling(false)
      }
    } else {
      setPullDistance(0)
      setIsPulling(false)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isPulling, isRefreshing, pullDistance])

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        <motion.div
          className="absolute left-0 right-0 flex justify-center items-center z-10"
          style={{ top: -60 + pullDistance }}
          animate={{
            opacity: pullDistance > 0 ? 1 : 0,
            y: refreshComplete ? 10 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{
              rotate: isRefreshing ? 360 : 0,
              scale: pullDistance > threshold ? 1.2 : 1,
              backgroundColor: refreshComplete ? "rgba(34, 197, 94, 0.2)" : "transparent",
              padding: refreshComplete ? 8 : 0,
              borderRadius: refreshComplete ? 9999 : 0,
            }}
            transition={{
              rotate: { repeat: isRefreshing ? Number.POSITIVE_INFINITY : 0, duration: 1, ease: "linear" },
              scale: { duration: 0.2 },
              backgroundColor: { duration: 0.3 },
            }}
            className="flex items-center justify-center"
          >
            {refreshComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle size={24} className="text-green-500" />
              </motion.div>
            ) : (
              <RefreshCw size={24} className={pullDistance > threshold ? "text-primary" : "text-muted-foreground"} />
            )}
          </motion.div>
          <span className="ml-2 text-sm">
            {refreshComplete
              ? "Refreshed!"
              : isRefreshing
                ? "Refreshing..."
                : pullDistance > threshold
                  ? "Release to refresh"
                  : "Pull to refresh"}
          </span>
        </motion.div>
      </AnimatePresence>

      <motion.div
        style={{ transform: `translateY(${pullDistance}px)` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
