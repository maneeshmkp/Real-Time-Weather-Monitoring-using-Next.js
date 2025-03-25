"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAlertHistory } from "@/lib/actions"
import type { WeatherAlert } from "@/lib/types"

export function AlertsHistory() {
  const [history, setHistory] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await fetchAlertHistory()
        setHistory(data)
      } catch (error) {
        console.error("Error fetching alert history:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
        <CardDescription>Recent weather alerts from the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-20 w-full"></div>
            <div className="skeleton h-20 w-full"></div>
            <div className="skeleton h-20 w-full"></div>
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((alert, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {alert.city}: {alert.type}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</div>
                </div>
                <div className="mt-1 text-sm">{alert.message}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <h3 className="mt-4 text-lg font-semibold">No alert history</h3>
            <p className="mt-2 text-sm text-muted-foreground">No alerts have been triggered in the past 7 days</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

