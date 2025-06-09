"use client"
import { useEffect, useRef, useState } from "react"
import type { PinnedPlace } from "@/app/maps/page"

interface MapComponentProps {
  pinnedPlaces: PinnedPlace[]
  onMapClick: (lat: number, lng: number, name?: string) => void
  selectedPlace: PinnedPlace | null
  onPlaceSelect: (place: PinnedPlace) => void
}

// Tunisia major cities data
const tunisianCities = [
  { name: "Bizerte", lat: 37.2744, lon: 9.8739 },
  { name: "Tunis", lat: 36.8065, lon: 10.1815 },
  { name: "Nabeul", lat: 36.4561, lon: 10.7376 },
  { name: "Hammamet", lat: 36.4, lon: 10.6167 },
  { name: "Sousse", lat: 35.8256, lon: 10.636 },
  { name: "Monastir", lat: 35.7643, lon: 10.8113 },
  { name: "Mahdia", lat: 35.5047, lon: 11.0622 },
  { name: "Sfax", lat: 34.7406, lon: 10.7603 },
  { name: "Medenine", lat: 33.3549, lon: 10.5055 },
]

declare global {
  interface Window {
    L: any
  }
}

export default function MapComponent({ pinnedPlaces, onMapClick, selectedPlace, onPlaceSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const cityMarkersRef = useRef<any[]>([])
  const pinMarkersRef = useRef<any[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Load Leaflet CSS and JS from CDN
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        link.crossOrigin = ""
        document.head.appendChild(link)
      }

      // Load JS
      if (!window.L) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          script.crossOrigin = ""
          script.onload = () => resolve(undefined)
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
    }

    const initializeMap = async () => {
      if (!mapRef.current) return

      try {
        await loadLeaflet()

        // Wait a bit for CSS to load
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Initialize the map
        const map = window.L.map(mapRef.current).setView([34.0, 9.5], 6)

        // Add OpenStreetMap tiles
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map)

        mapInstanceRef.current = map

        // Add city markers
        tunisianCities.forEach((city) => {
          const cityIcon = window.L.divIcon({
            html: `
              <div style="
                background-color: #dc2626;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
            `,
            className: "custom-city-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })

          const marker = window.L.marker([city.lat, city.lon], { icon: cityIcon }).addTo(map)
          marker.bindPopup(`<strong>${city.name}</strong><br/>Major City`)
          cityMarkersRef.current.push(marker)
        })

        // Handle map clicks
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng
          onMapClick(lat, lng)
        })

        // Add zoom control
        map.zoomControl.setPosition("topright")

        // Add scale control
        window.L.control.scale().addTo(map)

        setMapLoaded(true)
      } catch (error) {
        console.error("Failed to initialize Leaflet map:", error)
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update pin markers when pinnedPlaces changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return

    // Clear existing pin markers
    pinMarkersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    pinMarkersRef.current = []

    // Add new pin markers
    pinnedPlaces.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id

      const pinIcon = window.L.divIcon({
        html: `
          <div style="
            position: relative;
            width: 24px;
            height: 30px;
          ">
            <svg width="24" height="30" viewBox="0 0 24 30" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 18 12 18s12-10.8 12-18C24 5.4 18.6 0 12 0z" 
                    fill="${isSelected ? "#fbbf24" : "#059669"}" 
                    stroke="white" 
                    strokeWidth="1"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
            </svg>
          </div>
        `,
        className: "custom-pin-marker",
        iconSize: [24, 30],
        iconAnchor: [12, 30],
        popupAnchor: [0, -30],
      })

      const marker = window.L.marker([place.lat, place.lng], { icon: pinIcon }).addTo(mapInstanceRef.current)

      marker.bindPopup(`
        <div style="text-align: center;">
          <strong>${place.name}</strong><br/>
          <small>Lat: ${place.lat.toFixed(4)}, Lng: ${place.lng.toFixed(4)}</small>
        </div>
      `)

      // Handle marker click
      marker.on("click", () => {
        onPlaceSelect(place)
      })

      pinMarkersRef.current.push(marker)
    })
  }, [pinnedPlaces, selectedPlace, onPlaceSelect])

  // Handle selected place changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlace) return

    // Fly to selected place
    mapInstanceRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 12, {
      duration: 1.5,
    })
  }, [selectedPlace])

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-300">
      <div ref={mapRef} className="w-full h-full" />

      {/* Custom legend */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm z-[1000]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Major Cities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Pinned Places</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md text-xs text-gray-600 z-[1000]">
        Click anywhere to pin a location
      </div>

      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
