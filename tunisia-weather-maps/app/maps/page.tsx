"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trash2, Plus } from "lucide-react"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>,
})

export interface PinnedPlace {
  id: string
  name: string
  lat: number
  lng: number
  description?: string
}

export default function MapsPage() {
  const [pinnedPlaces, setPinnedPlaces] = useState<PinnedPlace[]>([])
  const [newPlaceName, setNewPlaceName] = useState("")
  const [selectedPlace, setSelectedPlace] = useState<PinnedPlace | null>(null)

  // Load pinned places from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("pinnedPlaces")
    if (saved) {
      setPinnedPlaces(JSON.parse(saved))
    }
  }, [])

  // Save pinned places to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pinnedPlaces", JSON.stringify(pinnedPlaces))
  }, [pinnedPlaces])

  const addPinnedPlace = (lat: number, lng: number, name?: string) => {
    const newPlace: PinnedPlace = {
      id: Date.now().toString(),
      name: name || newPlaceName || `Place ${pinnedPlaces.length + 1}`,
      lat,
      lng,
    }
    setPinnedPlaces([...pinnedPlaces, newPlace])
    setNewPlaceName("")
  }

  const removePinnedPlace = (id: string) => {
    setPinnedPlaces(pinnedPlaces.filter((place) => place.id !== id))
    if (selectedPlace?.id === id) {
      setSelectedPlace(null)
    }
  }

  const clearAllPlaces = () => {
    setPinnedPlaces([])
    setSelectedPlace(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Maps</h1>
          <p className="text-gray-600">Explore Tunisia and pin your favorite places</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Tunisia Map
                </CardTitle>
                <CardDescription>Click anywhere on the map to pin a location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] rounded-lg overflow-hidden">
                  <MapComponent
                    pinnedPlaces={pinnedPlaces}
                    onMapClick={addPinnedPlace}
                    selectedPlace={selectedPlace}
                    onPlaceSelect={setSelectedPlace}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Place */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Place
                </CardTitle>
                <CardDescription>Enter a name for your next pinned location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input
                    placeholder="Place name (optional)"
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Click on the map to pin a location</p>
                </div>
              </CardContent>
            </Card>

            {/* Pinned Places List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Pinned Places
                    </CardTitle>
                    <CardDescription>
                      {pinnedPlaces.length} location{pinnedPlaces.length !== 1 ? "s" : ""} saved
                    </CardDescription>
                  </div>
                  {pinnedPlaces.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllPlaces}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {pinnedPlaces.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No places pinned yet. Click on the map to add one!</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {pinnedPlaces.map((place) => (
                      <div
                        key={place.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedPlace?.id === place.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPlace(place)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{place.name}</h4>
                            <p className="text-xs text-gray-500">
                              {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removePinnedPlace(place.id)
                            }}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Place Info */}
            {selectedPlace && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Place</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">{selectedPlace.name}</h4>
                      <Badge variant="secondary" className="mt-1">
                        {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePinnedPlace(selectedPlace.id)}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Place
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
