"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface GoogleMapProps {
  coordinates: { lat: number; lng: number }
  onDrag?: (coordinates: { lat: number; lng: number }) => void
  darkMode?: boolean
}

export function GoogleMap({ coordinates, onDrag, darkMode = true }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [pinPosition, setPinPosition] = useState({ x: 0, y: 0 })
  const [mapCenter, setMapCenter] = useState(coordinates)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapboxToken = "pk.eyJ1Ijoic3JpMDAxIiwiYSI6ImNtOThjNDlpdTAxcTQybnF1YTU3eDZjdTkifQ.oe7EvHR_iF3eMrVPMsc8WA"
  const mapStyle = darkMode ? "dark-v10" : "streets-v11"

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

    // Center the pin
    const rect = mapRef.current.getBoundingClientRect()
    setPinPosition({
      x: rect.width / 2,
      y: rect.height / 2,
    })

    // Simulate map loading
    setTimeout(() => {
      setMapLoaded(true)
    }, 800)
  }, [])

  // Update map when coordinates change
  useEffect(() => {
    setMapCenter(coordinates)
  }, [coordinates])

  // Handle pin drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mapRef.current) return

    setIsDragging(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!mapRef.current) return

      const rect = mapRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Keep pin within bounds
      const boundedX = Math.max(0, Math.min(x, rect.width))
      const boundedY = Math.max(0, Math.min(y, rect.height))

      setPinPosition({ x: boundedX, y: boundedY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)

      // Calculate new coordinates based on pin position
      if (mapRef.current && onDrag) {
        const rect = mapRef.current.getBoundingClientRect()
        const latDiff = (pinPosition.y - rect.height / 2) * 0.0001
        const lngDiff = (pinPosition.x - rect.width / 2) * 0.0001

        const newCoordinates = {
          lat: mapCenter.lat - latDiff,
          lng: mapCenter.lng + lngDiff,
        }

        onDrag(newCoordinates)
      }

      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!mapRef.current) return

    setIsDragging(true)

    const handleTouchMove = (e: TouchEvent) => {
      if (!mapRef.current) return

      const touch = e.touches[0]
      const rect = mapRef.current.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      // Keep pin within bounds
      const boundedX = Math.max(0, Math.min(x, rect.width))
      const boundedY = Math.max(0, Math.min(y, rect.height))

      setPinPosition({ x: boundedX, y: boundedY })
    }

    const handleTouchEnd = () => {
      setIsDragging(false)

      // Calculate new coordinates based on pin position
      if (mapRef.current && onDrag) {
        const rect = mapRef.current.getBoundingClientRect()
        const latDiff = (pinPosition.y - rect.height / 2) * 0.0001
        const lngDiff = (pinPosition.x - rect.width / 2) * 0.0001

        const newCoordinates = {
          lat: mapCenter.lat - latDiff,
          lng: mapCenter.lng + lngDiff,
        }

        onDrag(newCoordinates)
      }

      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
  }

  return (
    <div
      ref={mapRef}
      className="relative h-full w-full bg-card cursor-grab active:cursor-grabbing overflow-hidden rounded-md"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {!mapLoaded ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div
            className="h-full w-full transition-opacity duration-500"
            style={{
              backgroundImage: `url("https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/${mapCenter.lng},${mapCenter.lat},14,0/600x300?access_token=${mapboxToken}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Map Pin */}
            <motion.div
              className={`absolute -translate-x-1/2 -translate-y-full ${isDragging ? "scale-110" : ""}`}
              style={{
                left: `${pinPosition.x}px`,
                top: `${pinPosition.y}px`,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
              animate={{
                y: isDragging ? [0, -5, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: isDragging ? Number.POSITIVE_INFINITY : 0,
                repeatType: "loop",
              }}
            >
              <MapPin size={32} className="text-primary" />
            </motion.div>

            {/* Coordinates Display */}
            <div className="absolute bottom-2 left-2 rounded-lg bg-card bg-opacity-80 px-2 py-1 text-xs text-foreground">
              {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
