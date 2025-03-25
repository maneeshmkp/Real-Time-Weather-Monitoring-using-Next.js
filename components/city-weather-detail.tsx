"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCityWeatherDetail } from "@/lib/actions"
import type { City, WeatherData, WeatherForecast } from "@/lib/types"
import { getWeatherIcon } from "@/lib/utils"
import { WeatherForecastChart } from "@/components/weather-forecast-chart"
import { WeatherParameters } from "@/components/weather-parameters"

interface CityWeatherDetailProps {
  city: City
}

export function CityWeatherDetail({ city }: CityWeatherDetailProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<WeatherForecast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWeatherDetail() {
      try {
        const data = await fetchCityWeatherDetail(city.id)
        setWeather(data.current)
        setForecast(data.forecast)
      } catch (error) {
        console.error(`Error fetching weather details for ${city.name}:`, error)
      } finally {
        setLoading(false)
      }
    }

    loadWeatherDetail()
    const interval = setInterval(loadWeatherDetail, 5 * 60 * 1000) // Refresh every 5 minutes

    return () => clearInterval(interval)
  }, [city.id, city.name])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="skeleton h-6 w-48"></CardTitle>
          <CardDescription className="skeleton h-4 w-32"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="skeleton h-[400px] w-full"></div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Details</CardTitle>
          <CardDescription>Data unavailable</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Unable to fetch weather data for {city.name}</p>
        </CardContent>
      </Card>
    )
  }

  const WeatherIcon = getWeatherIcon(weather.main)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <WeatherIcon className="h-10 w-10 text-primary" />
          <div>
            <CardTitle>
              {city.name} - {weather.main}
            </CardTitle>
            <CardDescription>Last updated: {new Date(weather.dt * 1000).toLocaleString()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-5xl font-bold">{Math.round(weather.temp)}°C</div>
            <div className="mt-1 text-lg text-muted-foreground">Feels like {Math.round(weather.feels_like)}°C</div>

            <div className="mt-6">
              <WeatherParameters weather={weather} />
            </div>
          </div>

          <div>
            <Tabs defaultValue="forecast">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
                <TabsTrigger value="hourly">Hourly</TabsTrigger>
              </TabsList>
              <TabsContent value="forecast" className="pt-4">
                <WeatherForecastChart data={forecast} type="daily" />
              </TabsContent>
              <TabsContent value="hourly" className="pt-4">
                <WeatherForecastChart data={forecast} type="hourly" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

