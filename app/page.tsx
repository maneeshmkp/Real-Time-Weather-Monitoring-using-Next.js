import { Suspense } from "react"
import type { Metadata } from "next"
import { CityWeatherCard } from "@/components/city-weather-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { WeatherAlerts } from "@/components/weather-alerts"
import { WeatherSummary } from "@/components/weather-summary"
import { WeatherSkeleton } from "@/components/weather-skeleton"
import { cities } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Weather Monitoring Dashboard",
  description: "Real-time weather monitoring system for Indian metros",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-6 md:p-8">
        <div className="grid gap-6">
          <h2 className="text-3xl font-bold tracking-tight">Current Weather</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Suspense key={city.id} fallback={<WeatherSkeleton />}>
                <CityWeatherCard city={city} />
              </Suspense>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <WeatherSummary />
          </div>
          <div>
            <WeatherAlerts />
          </div>
        </div>
      </main>
    </div>
  )
}

