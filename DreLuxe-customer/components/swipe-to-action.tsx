"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface SwipeToActionProps {
  children: React.ReactNode
  actions: {
    icon: React.ReactNode
    color: string
    onClick: () => void
  }[]
  threshold?: number
}

export function SwipeToAction({ children, actions, threshold = 80 }: SwipeToActionProps) {
  const [offset, setOffset] = useState(0)
  const [startX, setStartX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const actionWidth = 70 // Width of each action button

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)

      // Reset offset when component mounts or actions change
      setOffset(0)
    }

    // Add resize handler
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
        setOffset(0) // Reset offset on resize
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [actions.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX
    const diff = startX - currentX

    // Only allow swiping left (positive diff)
    if (diff > 0) {
      const maxOffset = actions.length * actionWidth
      const newOffset = Math.min(diff, maxOffset)
      setOffset(newOffset)
    }
  }

  const handleTouchEnd = () => {
    if (offset > threshold) {
      // Snap to open position
      setOffset(actions.length * actionWidth)
    } else {
      // Snap back to closed position
      setOffset(0)
    }
  }

  // Add mouse support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX
      const diff = startX - currentX

      if (diff > 0) {
        const maxOffset = actions.length * actionWidth
        const newOffset = Math.min(diff, maxOffset)
        setOffset(newOffset)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)

      if (offset > threshold) {
        setOffset(actions.length * actionWidth)
      } else {
        setOffset(0)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="swipe-action-container" ref={containerRef}>
      <motion.div
        className="swipe-action-content"
        style={{ transform: `translateX(-${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
      <div className="swipe-action-behind">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            className="h-full w-[70px] flex items-center justify-center"
            style={{
              backgroundColor: action.color,
              opacity: offset / (actions.length * actionWidth),
            }}
            onClick={action.onClick}
            whileTap={{ scale: 0.95 }}
          >
            {action.icon}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
