"use client"
import { motion } from "framer-motion"

interface LogoProps {
  width?: number
  height?: number
  className?: string
  animated?: boolean
  compact?: boolean
}

export function Logo({ width = 180, height = 90, className = "", animated = false, compact = false }: LogoProps) {
  if (animated) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        <div className="flex items-center gap-1">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <svg
              width={compact ? width * 0.2 : width * 0.3}
              height={compact ? height * 0.4 : height * 0.6}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <motion.path
                d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
              <motion.path
                d="M20 4L20 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
              <motion.path
                d="M20 4L12 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              />
            </svg>
          </motion.div>
          <motion.div
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 5, opacity: 1 }}
            transition={{
              y: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              opacity: {
                duration: 0.5,
                delay: 0.3,
              },
            }}
          >
            <h1 className={`${compact ? "text-xl" : "text-3xl"} font-montserrat font-bold tracking-tight`}>
              <motion.span
                className="text-primary inline-block"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                Dre
              </motion.span>
              <motion.span
                className="inline-block"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                Luxe
              </motion.span>
            </h1>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-1">
        <svg
          width={compact ? width * 0.2 : width * 0.3}
          height={compact ? height * 0.4 : height * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M20 4L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 4L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h1 className={`${compact ? "text-xl" : "text-3xl"} font-montserrat font-bold tracking-tight`}>
          <span className="text-primary">Dre</span>
          <span>Luxe</span>
        </h1>
      </div>
    </div>
  )
}
