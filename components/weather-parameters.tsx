import { Cloud, Droplets, Sunrise, Sunset, Thermometer, Wind } from "lucide-react"
import type { WeatherData } from "@/lib/types"

interface WeatherParametersProps {
  weather: WeatherData
}

export function WeatherParameters({ weather }: WeatherParametersProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Thermometer className="h-5 w-5 text-blue-500" />
        <div>
          <div className="text-sm font-medium">Min / Max</div>
          <div>
            {Math.round(weather.temp_min)}°C / {Math.round(weather.temp_max)}°C
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Wind className="h-5 w-5 text-blue-500" />
        <div>
          <div className="text-sm font-medium">Wind</div>
          <div>{weather.wind_speed} m/s</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Droplets className="h-5 w-5 text-blue-500" />
        <div>
          <div className="text-sm font-medium">Humidity</div>
          <div>{weather.humidity}%</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Cloud className="h-5 w-5 text-blue-500" />
        <div>
          <div className="text-sm font-medium">Clouds</div>
          <div>{weather.clouds}%</div>
        </div>
      </div>

      {weather.sunrise && weather.sunset && (
        <>
          <div className="flex items-center gap-2">
            <Sunrise className="h-5 w-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium">Sunrise</div>
              <div>
                {new Date(weather.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sunset className="h-5 w-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium">Sunset</div>
              <div>
                {new Date(weather.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

