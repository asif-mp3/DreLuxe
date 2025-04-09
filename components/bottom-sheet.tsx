"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo, useMotionValue, useTransform } from "framer-motion"
import { X } from "lucide-react"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  snapPoints?: number[]
  initialSnap?: number
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [sheetHeight, setSheetHeight] = useState(0)
  const y = useMotionValue(0)
  const bgOpacity = useTransform(y, [0, sheetHeight], [0.5, 0])

  useEffect(() => {
    if (isOpen) {
      setSheetHeight(window.innerHeight)
      document.body.style.overflow = "hidden" // Prevent background scrolling
    } else {
      document.body.style.overflow = "" // Restore scrolling
    }

    return () => {
      document.body.style.overflow = "" // Cleanup
    }
  }, [isOpen])

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { velocity, offset } = info
    const swipeThreshold = sheetHeight * 0.2

    if (velocity.y > 500 || offset.y > swipeThreshold) {
      onClose()
    } else {
      // Find the closest snap point
      const currentPosition = sheetHeight - offset.y
      const percentages = snapPoints.map((point) => point * sheetHeight)

      // Find the closest snap point
      let closestSnap = 0
      let minDistance = Number.POSITIVE_INFINITY

      percentages.forEach((point, index) => {
        const distance = Math.abs(currentPosition - point)
        if (distance < minDistance) {
          minDistance = distance
          closestSnap = index
        }
      })

      setCurrentSnap(closestSnap)
      y.set(0) // Reset y value after snapping
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ opacity: bgOpacity }}
          />
          <motion.div
            ref={sheetRef}
            className="bottom-sheet"
            style={{
              height: snapPoints[currentSnap] * 100 + "vh",
              y,
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div className="p-4">
              <div
                className="swipe-indicator"
                onPointerDown={(e) => {
                  // Ensure drag starts from the indicator
                  e.stopPropagation()
                  const event = e.nativeEvent as unknown as MouseEvent
                  sheetRef.current?.dispatchEvent(
                    new MouseEvent("mousedown", {
                      clientX: event.clientX,
                      clientY: event.clientY,
                      bubbles: true,
                    }),
                  )
                }}
              />
              {title && (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <motion.button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-muted"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              )}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
