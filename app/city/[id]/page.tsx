import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CityDetailHeader } from "@/components/city-detail-header"
import { CityWeatherDetail } from "@/components/city-weather-detail"
import { HistoricalWeather } from "@/components/historical-weather"
import { WeatherSkeleton } from "@/components/weather-skeleton"
import { cities } from "@/lib/constants"

interface CityPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  // Check if it's one of our predefined cities
  const city = cities.find((city) => city.id === params.id)

  if (city) {
    return {
      title: `${city.name} Weather`,
      description: `Real-time weather monitoring for ${city.name}`,
    }
  }

  // For searched cities, parse the ID to get the city name
  try {
    const parts = params.id.split("-")
    const country = parts.pop()
    const cityName = parts.join(" ")

    return {
      title: `${cityName.charAt(0).toUpperCase() + cityName.slice(1)} Weather`,
      description: `Real-time weather monitoring for ${cityName}`,
    }
  } catch (error) {
    return {
      title: "City Weather",
      description: "Real-time weather monitoring",
    }
  }
}

export default function CityPage({ params }: CityPageProps) {
  // Check if it's one of our predefined cities
  const predefinedCity = cities.find((city) => city.id === params.id)

  // For searched cities, create a city object from the ID
  let city = predefinedCity

  if (!city) {
    try {
      const parts = params.id.split("-")
      const country = parts.pop() || ""
      const cityName = parts.join(" ")

      city = {
        id: params.id,
        name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
        lat: 0, // These will be fetched in the component
        lon: 0,
        country: country.toUpperCase(),
      }
    } catch (error) {
      notFound()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CityDetailHeader city={city} />
      <main className="flex-1 space-y-6 p-6 md:p-8">
        <Suspense fallback={<WeatherSkeleton />}>
          <CityWeatherDetail city={city} />
        </Suspense>

        <div className="grid gap-6">
          <h2 className="text-2xl font-bold tracking-tight">Historical Data</h2>
          <HistoricalWeather cityId={city.id} />
        </div>
      </main>
    </div>
  )
}

