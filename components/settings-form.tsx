"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { saveSettings } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export function SettingsForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [settings, setSettings] = useState({
    apiKey: "",
    refreshInterval: 5,
    temperatureUnit: "celsius",
    darkMode: false,
    dataRetentionDays: 30,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await saveSettings(settings)
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure the weather monitoring system</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenWeatherMap API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="Enter your API key"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">
                OpenWeatherMap
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refreshInterval">Data Refresh Interval (minutes)</Label>
            <Select
              value={settings.refreshInterval.toString()}
              onValueChange={(value) => setSettings({ ...settings, refreshInterval: Number.parseInt(value) })}
            >
              <SelectTrigger id="refreshInterval">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperatureUnit">Temperature Unit</Label>
            <Select
              value={settings.temperatureUnit}
              onValueChange={(value) => setSettings({ ...settings, temperatureUnit: value })}
            >
              <SelectTrigger id="temperatureUnit">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                <SelectItem value="kelvin">Kelvin (K)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataRetentionDays">Data Retention Period (days)</Label>
            <Select
              value={settings.dataRetentionDays.toString()}
              onValueChange={(value) => setSettings({ ...settings, dataRetentionDays: Number.parseInt(value) })}
            >
              <SelectTrigger id="dataRetentionDays">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
            />
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

