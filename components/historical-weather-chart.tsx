"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { HistoricalData } from "@/lib/types"

interface HistoricalWeatherChartProps {
  data: HistoricalData[]
  type: "temperature" | "humidity" | "conditions"
}

export function HistoricalWeatherChart({ data, type }: HistoricalWeatherChartProps) {
  if (data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center">No data available</div>
  }

  if (type === "temperature") {
    return (
      <ChartContainer
        config={{
          avg: {
            label: "Average",
            color: "hsl(var(--chart-1))",
          },
          max: {
            label: "Maximum",
            color: "hsl(var(--chart-2))",
          },
          min: {
            label: "Minimum",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="h-[400px]"
      >
        <AreaChart
          data={data.map((day) => ({
            date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            avg: day.avgTemp,
            max: day.maxTemp,
            min: day.minTemp,
          }))}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit="°C" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="max" stroke="var(--color-max)" fill="var(--color-max)" fillOpacity={0.1} />
          <Area type="monotone" dataKey="avg" stroke="var(--color-avg)" fill="var(--color-avg)" fillOpacity={0.2} />
          <Area type="monotone" dataKey="min" stroke="var(--color-min)" fill="var(--color-min)" fillOpacity={0.1} />
        </AreaChart>
      </ChartContainer>
    )
  }

  if (type === "humidity") {
    return (
      <ChartContainer
        config={{
          humidity: {
            label: "Humidity",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[400px]"
      >
        <LineChart
          data={data.map((day) => ({
            date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            humidity: day.avgHumidity,
          }))}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit="%" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="humidity" stroke="var(--color-humidity)" strokeWidth={2} />
        </LineChart>
      </ChartContainer>
    )
  }

  // Process data to count occurrences of each weather condition
  const conditionCounts: Record<string, number> = {}
  data.forEach((day) => {
    if (day.dominantCondition) {
      conditionCounts[day.dominantCondition] = (conditionCounts[day.dominantCondition] || 0) + 1
    }
  })

  const chartData = Object.entries(conditionCounts).map(([condition, count]) => ({
    condition,
    count,
  }))

  return (
    <ChartContainer
      config={{
        count: {
          label: "Days",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[400px]"
    >
      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="condition" />
        <YAxis allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" />
      </BarChart>
    </ChartContainer>
  )
}

