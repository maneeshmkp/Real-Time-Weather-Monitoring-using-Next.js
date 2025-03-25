"use server"

import { revalidatePath } from "next/cache"
import type { City, WeatherData, WeatherForecast, DailySummary, WeatherAlert, HistoricalData } from "./types"
import { cities } from "./constants"

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Function to fetch real weather data from OpenWeatherMap API
export async function fetchCityWeather(cityId: string): Promise<WeatherData> {
  // Find the city in our predefined list
  const city = cities.find((c) => c.id === cityId)
  if (!city) {
    throw new Error(`City with ID ${cityId} not found`)
  }

  try {
    // Fetch real data from OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`)
    }

    const data = await response.json()

    // Map the API response to our WeatherData type
    return {
      dt: data.dt,
      main: data.weather[0].main,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    }
  } catch (error) {
    console.error(`Error fetching weather for ${city.name}:`, error)

    // Fallback to mock data if API call fails
    return {
      dt: Math.floor(Date.now() / 1000),
      main: ["Clear", "Clouds", "Rain", "Mist"][Math.floor(Math.random() * 4)],
      temp: 15 + Math.random() * 20,
      feels_like: 14 + Math.random() * 20,
      temp_min: 14 + Math.random() * 10,
      temp_max: 20 + Math.random() * 10,
      humidity: 30 + Math.floor(Math.random() * 60),
      wind_speed: 2 + Math.random() * 8,
      clouds: Math.floor(Math.random() * 100),
      sunrise: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
      sunset: Math.floor(Date.now() / 1000) + 21600, // 6 hours from now
    }
  }
}

export async function fetchCityByName(query: string): Promise<City[]> {
  if (!query || query.length < 2) return []

  try {
    // Fetch cities from OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`)
    }

    const data = await response.json()

    // Map the API response to our City type
    return data.map((item: any) => ({
      id: `${item.name.toLowerCase().replace(/\s+/g, "-")}-${item.country.toLowerCase()}`,
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
    }))
  } catch (error) {
    console.error("Error searching for city:", error)
    return []
  }
}

export async function fetchCityWeatherDetail(
  cityId: string,
): Promise<{ current: WeatherData; forecast: WeatherForecast[] }> {
  // Get current weather
  const current = await fetchCityWeather(cityId)

  // Find the city in our predefined list or search results
  let city: City | undefined

  // Check if it's one of our predefined cities
  city = cities.find((c) => c.id === cityId)

  // If not found, parse the ID to get coordinates (for searched cities)
  if (!city) {
    // For searched cities, we need to fetch the data again
    try {
      const parts = cityId.split("-")
      const country = parts.pop()
      const cityName = parts.join("-")

      const searchResults = await fetchCityByName(cityName.replace(/-/g, " "))
      city = searchResults.find((c) => c.country?.toLowerCase() === country)

      if (!city) {
        throw new Error(`City with ID ${cityId} not found`)
      }
    } catch (error) {
      console.error(`Error finding city with ID ${cityId}:`, error)
      throw error
    }
  }

  try {
    // Fetch forecast data from OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`)
    }

    const data = await response.json()

    // Map the API response to our WeatherForecast type
    const forecast: WeatherForecast[] = data.list.map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      main: item.weather[0].main,
    }))

    return { current, forecast }
  } catch (error) {
    console.error(`Error fetching forecast for ${city.name}:`, error)

    // Generate mock forecast data if API call fails
    const forecast: WeatherForecast[] = []
    const now = Math.floor(Date.now() / 1000)

    // Generate hourly forecast for next 48 hours
    for (let i = 1; i <= 48; i++) {
      forecast.push({
        dt: now + i * 3600,
        temp: current.temp + (Math.random() * 6 - 3),
        feels_like: current.feels_like + (Math.random() * 6 - 3),
        humidity: current.humidity + (Math.floor(Math.random() * 20) - 10),
        main: i % 8 === 0 ? ["Clear", "Clouds", "Rain"][Math.floor(Math.random() * 3)] : current.main,
      })
    }

    return { current, forecast }
  }
}

// Keep the rest of the functions as they are
export async function fetchDailySummary(): Promise<DailySummary[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate daily summaries for the past 7 days
  const summaries: DailySummary[] = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const cityData: Record<string, { avgTemp: number; maxTemp: number; minTemp: number; dominantCondition: string }> =
      {}

    cities.forEach((city) => {
      cityData[city.id] = {
        avgTemp: 15 + Math.random() * 15,
        maxTemp: 25 + Math.random() * 10,
        minTemp: 10 + Math.random() * 10,
        dominantCondition: ["Clear", "Clouds", "Rain", "Mist"][Math.floor(Math.random() * 4)],
      }
    })

    summaries.push({
      date: date.toISOString(),
      avgTemp: 15 + Math.random() * 15,
      maxTemp: 25 + Math.random() * 10,
      minTemp: 10 + Math.random() * 10,
      dominantCondition: ["Clear", "Clouds", "Rain", "Mist"][Math.floor(Math.random() * 4)],
      cityData,
    })
  }

  return summaries
}

export async function fetchActiveAlerts(): Promise<WeatherAlert[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Generate random alerts (sometimes empty)
  if (Math.random() > 0.7) {
    return []
  }

  const alerts: WeatherAlert[] = []
  const alertTypes = ["High Temperature", "Low Temperature", "Heavy Rain", "Strong Wind"]

  // Generate 1-3 random alerts
  const numAlerts = Math.floor(Math.random() * 3) + 1

  for (let i = 0; i < numAlerts; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)]
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

    alerts.push({
      city: city.name,
      type: alertType,
      message: `${alertType} alert for ${city.name}. Take necessary precautions.`,
      timestamp: Date.now() - Math.floor(Math.random() * 3600000),
    })
  }

  return alerts
}

export async function fetchAlertHistory(): Promise<WeatherAlert[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Generate historical alerts
  const alerts: WeatherAlert[] = []
  const alertTypes = ["High Temperature", "Low Temperature", "Heavy Rain", "Strong Wind"]

  // Generate 5-10 random historical alerts
  const numAlerts = Math.floor(Math.random() * 6) + 5

  for (let i = 0; i < numAlerts; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)]
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const daysAgo = Math.floor(Math.random() * 7) + 1

    alerts.push({
      city: city.name,
      type: alertType,
      message: `${alertType} alert for ${city.name}. Take necessary precautions.`,
      timestamp: Date.now() - daysAgo * 24 * 3600000 - Math.floor(Math.random() * 3600000),
    })
  }

  // Sort by timestamp (newest first)
  return alerts.sort((a, b) => b.timestamp - a.timestamp)
}

export async function fetchHistoricalWeather(cityId: string): Promise<HistoricalData[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 900))

  // Generate historical data for the past 30 days
  const data: HistoricalData[] = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const baseTemp = 15 + Math.sin(i / 5) * 10

    data.push({
      date: date.toISOString(),
      avgTemp: baseTemp + Math.random() * 2,
      maxTemp: baseTemp + 5 + Math.random() * 3,
      minTemp: baseTemp - 5 - Math.random() * 3,
      avgHumidity: 40 + Math.floor(Math.random() * 40),
      dominantCondition: i % 7 === 0 ? "Rain" : i % 5 === 0 ? "Clouds" : "Clear",
    })
  }

  return data
}

export async function saveAlertSettings(settings: any): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log("Alert settings saved:", settings)

  // In a real app, this would save to a database
  revalidatePath("/alerts")
  return
}

export async function saveSettings(settings: any): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log("Settings saved:", settings)

  // In a real app, this would save to a database
  revalidatePath("/settings")
  return
}

