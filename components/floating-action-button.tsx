"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Plus, X } from "lucide-react"

interface FloatingActionButtonProps {
  actions?: {
    icon: React.ReactNode
    label: string
    onClick: () => void
    color?: string
  }[]
  onClick?: () => void
  position?: "bottom-right" | "bottom-left" | "bottom-center"
}

export function FloatingActionButton({ actions, onClick, position = "bottom-right" }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
        if (isOpen) setIsOpen(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, isOpen])

  const handleClick = () => {
    if (actions && actions.length > 0) {
      setIsOpen(!isOpen)

      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    } else if (onClick) {
      onClick()

      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "left-4 bottom-20"
      case "bottom-center":
        return "left-1/2 -translate-x-1/2 bottom-20"
      case "bottom-right":
      default:
        return "right-4 bottom-20"
    }
  }

  // Animation variants
  const fabVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const actionVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: custom * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
    exit: (custom: number) => ({
      opacity: 0,
      y: 20,
      scale: 0.8,
      transition: {
        delay: custom * 0.02,
      },
    }),
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`fab ${getPositionClasses()} z-50 h-14 w-14`}
            variants={fabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClick}
            whileTap={{ scale: 0.9 }}
            style={{
              boxShadow: isOpen ? "0 10px 25px -5px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <motion.div
              animate={{
                rotate: isOpen ? 45 : 0,
                scale: isOpen ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={24} /> : <Plus size={24} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && actions && (
          <div className={`fixed ${getPositionClasses()} z-40 mb-16`}>
            <div className="flex flex-col-reverse gap-2">
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  custom={actions.length - index}
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`flex items-center gap-2 rounded-full ${action.color || "bg-card"} text-foreground px-4 py-2 shadow-lg`}
                  onClick={() => {
                    setIsOpen(false)
                    action.onClick()
                  }}
                  whileHover={{ scale: 1.05, x: position === "bottom-right" ? -5 : position === "bottom-left" ? 5 : 0 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
