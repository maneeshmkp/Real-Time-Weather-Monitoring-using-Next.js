"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchHistoricalWeather } from "@/lib/actions"
import type { HistoricalData } from "@/lib/types"
import { HistoricalWeatherChart } from "@/components/historical-weather-chart"

interface HistoricalWeatherProps {
  cityId: string
}

export function HistoricalWeather({ cityId }: HistoricalWeatherProps) {
  const [data, setData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHistoricalData() {
      try {
        const historicalData = await fetchHistoricalWeather(cityId)
        setData(historicalData)
      } catch (error) {
        console.error("Error fetching historical data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHistoricalData()
  }, [cityId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Weather Data</CardTitle>
        <CardDescription>Weather trends over the past 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="skeleton h-[400px] w-full"></div>
        ) : data.length > 0 ? (
          <Tabs defaultValue="temperature">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>
            <TabsContent value="temperature" className="pt-4">
              <HistoricalWeatherChart data={data} type="temperature" />
            </TabsContent>
            <TabsContent value="humidity" className="pt-4">
              <HistoricalWeatherChart data={data} type="humidity" />
            </TabsContent>
            <TabsContent value="conditions" className="pt-4">
              <HistoricalWeatherChart data={data} type="conditions" />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex h-[300px] items-center justify-center">No historical data available</div>
        )}
      </CardContent>
    </Card>
  )
}

