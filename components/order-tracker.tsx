"use client"

import { motion } from "framer-motion"
import { Check, Truck, Droplets, Wind } from "lucide-react"
import type React from "react"

type OrderStatus = "pickup" | "washing" | "drying" | "delivery" | "completed"

interface OrderTrackerProps {
  status: OrderStatus
  showProgressBar?: boolean
  animateIcons?: boolean
}

const STATUS_ORDER: OrderStatus[] = ["pickup", "washing", "drying", "delivery", "completed"]

export function OrderTracker({ status, showProgressBar = true, animateIcons = true }: OrderTrackerProps) {
  const currentIndex = STATUS_ORDER.indexOf(status)
  const progressPercentage = (currentIndex / (STATUS_ORDER.length - 1)) * 100

  return (
    <div className="w-full space-y-6">
      {/* Progress Bar - Optional */}
      {showProgressBar && (
        <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Status Icons */}
      <div className="flex justify-between">
        {STATUS_ORDER.map((step, index) => (
          <StatusIcon
            key={step}
            icon={getIconForStep(step)}
            label={getLabelForStep(step)}
            isActive={currentIndex >= index}
            isCompleted={currentIndex > index}
            delay={animateIcons ? index * 0.1 : 0}
            animate={animateIcons}
          />
        ))}
      </div>
    </div>
  )
}

// Helper functions for step configuration
function getIconForStep(step: OrderStatus): React.ElementType {
  switch (step) {
    case "pickup":
      return Truck
    case "washing":
      return Droplets
    case "drying":
      return Wind
    case "delivery":
      return Truck
    case "completed":
      return Check
    default:
      return Check
  }
}

function getLabelForStep(step: OrderStatus): string {
  return step.charAt(0).toUpperCase() + step.slice(1)
}

interface StatusIconProps {
  icon: React.ElementType
  label: string
  isActive: boolean
  isCompleted: boolean
  delay?: number
  animate?: boolean
}

function StatusIcon({ icon: Icon, label, isActive, isCompleted, delay = 0, animate = true }: StatusIconProps) {
  const baseClasses = "flex h-10 w-10 items-center justify-center rounded-full transition-colors"
  const activeClasses = isCompleted
    ? "bg-green-500 text-white"
    : isActive
      ? "bg-primary text-white"
      : "bg-muted text-muted-foreground"

  const iconAnimation = animate
    ? {
        initial: { scale: 0.8, opacity: 0, y: 10 },
        animate: { scale: isActive ? 1 : 0.9, opacity: 1, y: 0 },
        whileHover: { scale: 1.1 },
        transition: {
          duration: 0.3,
          delay,
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }
    : {}

  const labelAnimation = animate
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3, delay: delay + 0.1 },
      }
    : {}

  return (
    <div className="flex flex-col items-center">
      <motion.div className={`${baseClasses} ${activeClasses}`} {...iconAnimation}>
        <Icon size={20} />
      </motion.div>
      <motion.span
        className={`mt-1 text-xs ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`}
        {...labelAnimation}
      >
        {label}
      </motion.span>
    </div>
  )
}
