"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface AnimatedNotificationProps {
  title: string
  message: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose?: () => void
  isVisible?: boolean
}

export function AnimatedNotification({
  title,
  message,
  type = "info",
  duration = 5000,
  onClose,
  isVisible = true,
}: AnimatedNotificationProps) {
  const [visible, setVisible] = useState(isVisible)

  useEffect(() => {
    setVisible(isVisible)
  }, [isVisible])

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible, duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white"
      case "error":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-amber-500 text-white"
      case "info":
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case "error":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case "warning":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )
      case "info":
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed top-4 left-0 right-0 mx-auto w-full max-w-md z-50 rounded-lg shadow-lg overflow-hidden ${getTypeStyles()}`}
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-4 flex items-start">
            <div className="flex-shrink-0 mr-3">{getIcon()}</div>
            <div className="flex-1">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm opacity-90">{message}</p>
            </div>
            <button
              onClick={() => {
                setVisible(false)
                if (onClose) onClose()
              }}
              className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
          <motion.div
            className="h-1 bg-white/30"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
