export interface City {
  id: string
  name: string
  lat: number
  lon: number
  country?: string
}

export interface WeatherData {
  dt: number
  main: string
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  humidity: number
  wind_speed: number
  clouds: number
  sunrise?: number
  sunset?: number
}

export interface WeatherForecast {
  dt: number
  temp: number
  feels_like: number
  humidity: number
  main: string
}

export interface DailySummary {
  date: string
  avgTemp: number
  maxTemp: number
  minTemp: number
  dominantCondition: string
  cityData?: Record<
    string,
    {
      avgTemp: number
      maxTemp: number
      minTemp: number
      dominantCondition: string
    }
  >
}

export interface WeatherAlert {
  city: string
  type: string
  message: string
  timestamp: number
}

export interface HistoricalData {
  date: string
  avgTemp: number
  maxTemp: number
  minTemp: number
  avgHumidity: number
  dominantCondition: string
}

