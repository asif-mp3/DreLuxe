"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  pulse: boolean
  pulseSpeed: number
  maxSize: number
  minSize: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mediaQuery.matches)

    const handleReducedMotionChange = () => setIsReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleReducedMotionChange)

    return () => mediaQuery.removeEventListener("change", handleReducedMotionChange)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Handle touch for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      }
    }

    window.addEventListener("touchmove", handleTouchMove)

    // Create particles
    const createParticles = () => {
      particles.current = []
      const particleCount = Math.min(isReducedMotion ? 15 : 30, Math.floor(window.innerWidth / 40))

      // Primary color particles (green)
      const primaryColor = "rgba(34, 197, 94, 0.6)"
      // Secondary color particles (darker green)
      const secondaryColor = "rgba(21, 128, 61, 0.4)"
      // Accent color particles
      const accentColor = "rgba(59, 130, 246, 0.5)"

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 4 + 1
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          minSize: size * 0.7,
          maxSize: size * 1.3,
          speedX: (Math.random() - 0.5) * (isReducedMotion ? 0.1 : 0.5),
          speedY: (Math.random() - 0.5) * (isReducedMotion ? 0.1 : 0.5),
          opacity: Math.random() * 0.5 + 0.1,
          color: Math.random() > 0.8 ? accentColor : Math.random() > 0.5 ? primaryColor : secondaryColor,
          pulse: true,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        })
      }
    }

    createParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Pulse size
        if (particle.pulse) {
          if (particle.size >= particle.maxSize) {
            particle.pulse = false
          } else {
            particle.size += particle.pulseSpeed
          }
        } else {
          if (particle.size <= particle.minSize) {
            particle.pulse = true
          } else {
            particle.size -= particle.pulseSpeed
          }
        }

        // Interact with mouse
        if (mousePosition) {
          const dx = mousePosition.x - particle.x
          const dy = mousePosition.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            // Move particles away from mouse
            const angle = Math.atan2(dy, dx)
            const force = (maxDistance - distance) / maxDistance

            particle.x -= Math.cos(angle) * force * 2
            particle.y -= Math.sin(angle) * force * 2

            // Increase opacity when near mouse
            particle.opacity = Math.min(0.8, particle.opacity + force * 0.2)
          } else {
            // Gradually return to original opacity
            particle.opacity = Math.max(0.1, particle.opacity - 0.01)
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, `${particle.opacity})`)
        ctx.fill()

        // Draw connecting lines between nearby particles
        particles.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      cancelAnimationFrame(animationId)
    }
  }, [isReducedMotion])

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}
