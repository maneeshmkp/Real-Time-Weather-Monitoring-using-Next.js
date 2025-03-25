"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchDailySummary } from "@/lib/actions"
import type { DailySummary } from "@/lib/types"
import { DailySummaryChart } from "@/components/daily-summary-chart"

export function WeatherSummary() {
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSummaries() {
      try {
        const data = await fetchDailySummary()
        setSummaries(data)
      } catch (error) {
        console.error("Error fetching daily summaries:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSummaries()
    const interval = setInterval(loadSummaries, 30 * 60 * 1000) // Refresh every 30 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Weather Summary</CardTitle>
        <CardDescription>Aggregated weather data for the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-[300px] w-full"></div>
          </div>
        ) : (
          <Tabs defaultValue="temperature">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="cities">By City</TabsTrigger>
            </TabsList>
            <TabsContent value="temperature" className="pt-4">
              <DailySummaryChart data={summaries} type="temperature" />
            </TabsContent>
            <TabsContent value="conditions" className="pt-4">
              <DailySummaryChart data={summaries} type="conditions" />
            </TabsContent>
            <TabsContent value="cities" className="pt-4">
              <DailySummaryChart data={summaries} type="cities" />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

