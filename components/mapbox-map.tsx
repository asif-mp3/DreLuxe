"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapboxMapProps {
  coordinates: { lat: number; lng: number }
  onDrag: (coords: { lat: number; lng: number }) => void
  mapboxToken: string
}

export default function MapboxMap({ coordinates, onDrag, mapboxToken }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map only once
    if (!map.current) {
      mapboxgl.accessToken = mapboxToken

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [coordinates.lng, coordinates.lat],
        zoom: 14,
      })

      marker.current = new mapboxgl.Marker({
        draggable: true,
        color: "#1DB954",
      })
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map.current)

      marker.current.on("dragend", () => {
        const lngLat = marker.current?.getLngLat()
        if (lngLat) {
          onDrag({ lat: lngLat.lat, lng: lngLat.lng })
        }
      })
    }

    // Update marker position when coordinates change
    if (marker.current) {
      marker.current.setLngLat([coordinates.lng, coordinates.lat])
    }

    // Update map center when coordinates change
    if (map.current) {
      map.current.setCenter([coordinates.lng, coordinates.lat])
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [coordinates, onDrag, mapboxToken])

  return <div ref={mapContainer} className="h-full w-full" />
}
