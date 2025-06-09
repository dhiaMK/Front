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
    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`)

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      {
        headers: {
          "User-Agent": "Tunisia Weather App/1.0",
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OpenWeather API error: ${response.status} ${response.statusText}`, errorText)

      if (response.status === 401) {
        return NextResponse.json({ error: "Invalid API key. Please check your OpenWeather API key." }, { status: 401 })
      }

      if (response.status === 429) {
        return NextResponse.json({ error: "API rate limit exceeded. Please try again later." }, { status: 429 })
      }

      return NextResponse.json(
        { error: `OpenWeather API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Weather data received:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data. Please check your internet connection." },
      { status: 500 },
    )
  }
}
