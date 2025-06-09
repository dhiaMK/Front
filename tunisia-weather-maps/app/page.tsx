import Link from "next/link"
import { Cloud, Map, MapPin, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Tunisia Hub</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore weather conditions across Tunisian cities and discover places on interactive maps
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-blue-600" />
              Weather Information
            </CardTitle>
            <CardDescription>Get real-time weather data for major cities across Tunisia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Thermometer className="w-4 h-4" />
                <span>Temperature, humidity, and conditions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Multiple Tunisian cities available</span>
              </div>
              <Link href="/weather">
                <Button className="w-full">View Weather</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-6 h-6 text-green-600" />
              Interactive Maps
            </CardTitle>
            <CardDescription>Explore Tunisia with interactive maps and pin your favorite places</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Click to pin locations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Map className="w-4 h-4" />
                <span>Interactive Leaflet maps</span>
              </div>
              <Link href="/maps">
                <Button className="w-full" variant="outline">
                  Explore Maps
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
