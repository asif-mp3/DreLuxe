"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface AnimatedIconProps {
  icon: LucideIcon
  size?: number
  color?: string
  animation?: "pulse" | "bounce" | "spin" | "shake" | "wiggle" | "ping"
  className?: string
  onClick?: () => void
}

export function AnimatedIcon({
  icon: Icon,
  size = 24,
  color,
  animation = "pulse",
  className = "",
  onClick,
}: AnimatedIconProps) {
  const getAnimationProps = () => {
    switch (animation) {
      case "pulse":
        return {
          animate: { scale: [1, 1.1, 1] },
          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
        }
      case "bounce":
        return {
          animate: { y: [0, -10, 0] },
          transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
        }
      case "spin":
        return {
          animate: { rotate: 360 },
          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
        }
      case "shake":
        return {
          animate: { x: [0, -5, 5, -5, 5, 0] },
          transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 },
        }
      case "wiggle":
        return {
          animate: { rotate: [0, -10, 10, -10, 10, 0] },
          transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 },
        }
      case "ping":
        return {
          animate: {
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          },
          transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
        }
      default:
        return {}
    }
  }

  const animationProps = getAnimationProps()

  return (
    <motion.div
      className={className}
      {...animationProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <Icon size={size} color={color} />
    </motion.div>
  )
}
