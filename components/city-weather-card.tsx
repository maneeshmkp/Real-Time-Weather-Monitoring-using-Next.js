"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Droplets, Thermometer, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchCityWeather } from "@/lib/actions"
import type { City, WeatherData } from "@/lib/types"
import { getWeatherIcon } from "@/lib/utils"

interface CityWeatherCardProps {
  city: City
}

export function CityWeatherCard({ city }: CityWeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchCityWeather(city.id)
        setWeather(data)
      } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error)
      } finally {
        setLoading(false)
      }
    }

    loadWeather()
    const interval = setInterval(loadWeather, 5 * 60 * 1000) // Refresh every 5 minutes

    return () => clearInterval(interval)
  }, [city.id, city.name])

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="skeleton h-6 w-24"></CardTitle>
          <CardDescription className="skeleton h-4 w-32"></CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="skeleton h-16 w-16 rounded-full"></div>
          <div className="skeleton h-8 w-16 mt-2"></div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle>{city.name}</CardTitle>
          <CardDescription>Data unavailable</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <p>Unable to fetch weather data</p>
        </CardContent>
      </Card>
    )
  }

  const WeatherIcon = getWeatherIcon(weather.main)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{city.name}</CardTitle>
            <CardDescription>
              {new Date(weather.dt * 1000).toLocaleTimeString()} • {weather.main}
            </CardDescription>
          </div>
          <Badge variant={weather.temp > 35 ? "destructive" : weather.temp < 10 ? "secondary" : "default"}>
            {weather.temp > 35 ? "Hot" : weather.temp < 10 ? "Cold" : "Normal"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4">
          <WeatherIcon className="h-16 w-16 text-primary" />
          <div>
            <div className="text-3xl font-bold">{Math.round(weather.temp)}°C</div>
            <div className="text-sm text-muted-foreground">Feels like {Math.round(weather.feels_like)}°C</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{weather.humidity}% Humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{weather.wind_speed} m/s</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Min: {Math.round(weather.temp_min)}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm">Max: {Math.round(weather.temp_max)}°C</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/city/${city.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

