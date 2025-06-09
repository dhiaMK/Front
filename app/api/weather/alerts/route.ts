import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  // Hardcoded API key
  const API_KEY = "09187528de32741275f391a0f544cbc7"

  try {
    console.log(`Fetching weather alerts for coordinates: ${lat}, ${lon}`)

    // Try to fetch from OpenWeather One Call API for alerts
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&exclude=minutely,hourly,daily`,
      {
        headers: {
          "User-Agent": "Tunisia Weather App/1.0",
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      console.log(`OpenWeather One Call API not available: ${response.status}`)

      // If One Call API is not available (requires subscription), return empty alerts
      // In a real application, you might want to integrate with local meteorological services
      return NextResponse.json({ alerts: [] })
    }

    const data = await response.json()
    console.log("Weather alerts data received:", data)

    // Return alerts if they exist, otherwise empty array
    return NextResponse.json({
      alerts: data.alerts || [],
    })
  } catch (error) {
    console.error("Weather alerts API error:", error)

    // Return empty alerts array if API fails
    return NextResponse.json({ alerts: [] })
  }
}
