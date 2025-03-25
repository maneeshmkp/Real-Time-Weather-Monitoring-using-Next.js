"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CitySearch } from "@/components/city-search"

export function DashboardHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="text-xl">Weather Monitor</span>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 mx-6">
          <CitySearch />
        </div>
        <nav className="flex items-center gap-4">
          <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant={pathname === "/alerts" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/alerts">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
            </Link>
          </Button>
          <Button variant={pathname === "/settings" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
      <div className="md:hidden p-2">
        <CitySearch />
      </div>
    </header>
  )
}

