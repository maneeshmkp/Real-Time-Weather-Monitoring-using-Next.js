"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { DailySummary } from "@/lib/types"

interface DailySummaryChartProps {
  data: DailySummary[]
  type: "temperature" | "conditions" | "cities"
}

export function DailySummaryChart({ data, type }: DailySummaryChartProps) {
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
        className="h-[300px]"
      >
        <LineChart
          data={data.map((day) => ({
            date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            avg: day.avgTemp,
            max: day.maxTemp,
            min: day.minTemp,
          }))}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit="°C" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="avg" stroke="var(--color-avg)" strokeWidth={2} />
          <Line type="monotone" dataKey="max" stroke="var(--color-max)" strokeWidth={2} />
          <Line type="monotone" dataKey="min" stroke="var(--color-min)" strokeWidth={2} />
        </LineChart>
      </ChartContainer>
    )
  }

  if (type === "conditions") {
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
        className="h-[300px]"
      >
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="condition" />
          <YAxis allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" />
        </BarChart>
      </ChartContainer>
    )
  }

  // By cities
  return (
    <ChartContainer
      config={{
        delhi: {
          label: "Delhi",
          color: "hsl(var(--chart-1))",
        },
        mumbai: {
          label: "Mumbai",
          color: "hsl(var(--chart-2))",
        },
        bangalore: {
          label: "Bangalore",
          color: "hsl(var(--chart-3))",
        },
        chennai: {
          label: "Chennai",
          color: "hsl(var(--chart-4))",
        },
        kolkata: {
          label: "Kolkata",
          color: "hsl(var(--chart-5))",
        },
        hyderabad: {
          label: "Hyderabad",
          color: "hsl(var(--chart-6))",
        },
      }}
      className="h-[300px]"
    >
      <AreaChart
        data={data.map((day) => ({
          date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          delhi: day.cityData?.delhi?.avgTemp || null,
          mumbai: day.cityData?.mumbai?.avgTemp || null,
          bangalore: day.cityData?.bangalore?.avgTemp || null,
          chennai: day.cityData?.chennai?.avgTemp || null,
          kolkata: day.cityData?.kolkata?.avgTemp || null,
          hyderabad: day.cityData?.hyderabad?.avgTemp || null,
        }))}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis unit="°C" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="delhi" stroke="var(--color-delhi)" fill="var(--color-delhi)" fillOpacity={0.2} />
        <Area
          type="monotone"
          dataKey="mumbai"
          stroke="var(--color-mumbai)"
          fill="var(--color-mumbai)"
          fillOpacity={0.2}
        />
        <Area
          type="monotone"
          dataKey="bangalore"
          stroke="var(--color-bangalore)"
          fill="var(--color-bangalore)"
          fillOpacity={0.2}
        />
        <Area
          type="monotone"
          dataKey="chennai"
          stroke="var(--color-chennai)"
          fill="var(--color-chennai)"
          fillOpacity={0.2}
        />
        <Area
          type="monotone"
          dataKey="kolkata"
          stroke="var(--color-kolkata)"
          fill="var(--color-kolkata)"
          fillOpacity={0.2}
        />
        <Area
          type="monotone"
          dataKey="hyderabad"
          stroke="var(--color-hyderabad)"
          fill="var(--color-hyderabad)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

