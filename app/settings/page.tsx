import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { SettingsForm } from "@/components/settings-form"

export const metadata: Metadata = {
  title: "Weather Monitoring Settings",
  description: "Configure settings for the weather monitoring system",
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-6 md:p-8">
        <div className="grid gap-6">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <SettingsForm />
        </div>
      </main>
    </div>
  )
}

