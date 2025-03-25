import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function WeatherSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="skeleton h-6 w-24"></div>
        <div className="skeleton h-4 w-32"></div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4">
          <div className="skeleton h-16 w-16 rounded-full"></div>
          <div>
            <div className="skeleton h-8 w-16"></div>
            <div className="skeleton h-4 w-24 mt-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-20"></div>
        </div>
      </CardContent>
    </Card>
  )
}

