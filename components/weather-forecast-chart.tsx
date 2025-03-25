"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { WeatherForecast } from "@/lib/types"

interface WeatherForecastChartProps {
  data: WeatherForecast[]
  type: "daily" | "hourly"
}

export function WeatherForecastChart({ data, type }: WeatherForecastChartProps) {
  if (data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center">No forecast data available</div>
  }

  const chartData = data.map((item) => {
    const date = new Date(item.dt * 1000)
    return {
      time:
        type === "daily"
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp: Math.round(item.temp),
      feels_like: Math.round(item.feels_like),
      humidity: item.humidity,
    }
  })

  // For hourly, limit to next 24 hours
  const limitedData = type === "hourly" ? chartData.slice(0, 24) : chartData

  return (
    <ChartContainer
      config={{
        temp: {
          label: "Temperature",
          color: "hsl(var(--chart-1))",
        },
        feels_like: {
          label: "Feels Like",
          color: "hsl(var(--chart-2))",
        },
        humidity: {
          label: "Humidity",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <LineChart data={limitedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="left" unit="°C" />
        <YAxis yAxisId="right" orientation="right" unit="%" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line yAxisId="left" type="monotone" dataKey="temp" stroke="var(--color-temp)" strokeWidth={2} />
        <Line yAxisId="left" type="monotone" dataKey="feels_like" stroke="var(--color-feels_like)" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="var(--color-humidity)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}

