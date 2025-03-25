"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchActiveAlerts } from "@/lib/actions"
import type { WeatherAlert } from "@/lib/types"

export function WeatherAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await fetchActiveAlerts()
        setAlerts(data)
      } catch (error) {
        console.error("Error fetching alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
    const interval = setInterval(loadAlerts, 5 * 60 * 1000) // Refresh every 5 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
        <CardDescription>Weather conditions exceeding defined thresholds</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-20 w-full"></div>
            <div className="skeleton h-20 w-full"></div>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>
                  {alert.city}: {alert.type}
                </AlertTitle>
                <AlertDescription>
                  {alert.message} • {new Date(alert.timestamp).toLocaleString()}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No active alerts</h3>
            <p className="mt-2 text-sm text-muted-foreground">All weather conditions are within normal ranges</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

