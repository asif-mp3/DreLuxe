"use client"

import { motion } from "framer-motion"
import { CloudDrizzle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WeatherBannerProps {
  onDismiss: () => void
}

export function WeatherBanner({ onDismiss }: WeatherBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative mx-auto mb-4 max-w-md rounded-lg bg-gradient-to-r from-primary/80 to-primary p-4 text-primary-foreground shadow-lg"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 text-primary-foreground hover:bg-primary/20"
        onClick={onDismiss}
      >
        <X size={14} />
      </Button>

      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          <CloudDrizzle size={24} className="text-primary-foreground" />
        </motion.div>
        <div>
          <h3 className="font-medium">Rain expected today</h3>
          <p className="text-sm text-primary-foreground/90">Schedule your pickup early to avoid delays</p>
        </div>
      </div>
    </motion.div>
  )
}
