import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { AlertsConfiguration } from "@/components/alerts-configuration"
import { AlertsHistory } from "@/components/alerts-history"

export const metadata: Metadata = {
  title: "Weather Alerts Configuration",
  description: "Configure weather alerts and view alert history",
}

export default function AlertsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-6 md:p-8">
        <div className="grid gap-6">
          <h2 className="text-3xl font-bold tracking-tight">Weather Alerts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <AlertsConfiguration />
            <AlertsHistory />
          </div>
        </div>
      </main>
    </div>
  )
}

