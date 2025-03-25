"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { saveAlertSettings } from "@/lib/actions"
import { cities } from "@/lib/constants"
import { useToast } from "@/components/ui/use-toast"

export function AlertsConfiguration() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [settings, setSettings] = useState({
    highTempThreshold: 35,
    lowTempThreshold: 10,
    consecutiveReadings: 2,
    enableEmailAlerts: false,
    emailAddress: "",
    selectedCities: cities.map((city) => city.id),
    alertConditions: ["temperature", "rain", "snow"],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await saveAlertSettings(settings)
      toast({
        title: "Settings saved",
        description: "Your alert configuration has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save alert settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Alerts</CardTitle>
        <CardDescription>Set thresholds for weather condition alerts</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="highTempThreshold">High Temperature Threshold (°C)</Label>
            <Input
              id="highTempThreshold"
              type="number"
              value={settings.highTempThreshold}
              onChange={(e) => setSettings({ ...settings, highTempThreshold: Number.parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowTempThreshold">Low Temperature Threshold (°C)</Label>
            <Input
              id="lowTempThreshold"
              type="number"
              value={settings.lowTempThreshold}
              onChange={(e) => setSettings({ ...settings, lowTempThreshold: Number.parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consecutiveReadings">Consecutive Readings Required</Label>
            <Select
              value={settings.consecutiveReadings.toString()}
              onValueChange={(value) => setSettings({ ...settings, consecutiveReadings: Number.parseInt(value) })}
            >
              <SelectTrigger id="consecutiveReadings">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 reading</SelectItem>
                <SelectItem value="2">2 readings</SelectItem>
                <SelectItem value="3">3 readings</SelectItem>
                <SelectItem value="4">4 readings</SelectItem>
                <SelectItem value="5">5 readings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertConditions">Alert Conditions</Label>
            <Select
              value={settings.alertConditions.join(",")}
              onValueChange={(value) => setSettings({ ...settings, alertConditions: value.split(",") })}
            >
              <SelectTrigger id="alertConditions">
                <SelectValue placeholder="Select conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="temperature,rain">Temperature & Rain</SelectItem>
                <SelectItem value="temperature,rain,snow">Temperature, Rain & Snow</SelectItem>
                <SelectItem value="all">All Conditions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableEmailAlerts">Email Notifications</Label>
              <Switch
                id="enableEmailAlerts"
                checked={settings.enableEmailAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, enableEmailAlerts: checked })}
              />
            </div>
            {settings.enableEmailAlerts && (
              <Input
                id="emailAddress"
                type="email"
                placeholder="Enter your email address"
                value={settings.emailAddress}
                onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

