import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeatherIcon(condition: string) {
  switch (condition.toLowerCase()) {
    case "clear":
      return Sun
    case "clouds":
      return Cloud
    case "rain":
      return CloudRain
    case "drizzle":
      return CloudDrizzle
    case "thunderstorm":
      return CloudLightning
    case "snow":
      return CloudSnow
    case "mist":
    case "fog":
      return CloudFog
    default:
      return Cloud
  }
}

