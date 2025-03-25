"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { fetchCityByName } from "@/lib/actions"
import type { City } from "@/lib/types"

export function CitySearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<City[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await fetchCityByName(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching for city:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelect = (city: City) => {
    router.push(`/city/${city.id}`)
    setOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <>
      <Button variant="outline" className="w-full md:w-auto md:max-w-sm relative" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4 mr-2" />
        <span className="text-muted-foreground">Search for a city...</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for a city..."
          value={searchQuery}
          onValueChange={(value) => {
            setSearchQuery(value)
            handleSearch(value)
          }}
        />
        <CommandList>
          <CommandEmpty>{isSearching ? "Searching..." : "No cities found."}</CommandEmpty>
          <CommandGroup heading="Results">
            {searchResults.map((city) => (
              <CommandItem key={city.id} onSelect={() => handleSelect(city)}>
                <span>{city.name}</span>
                {city.country && <span className="text-muted-foreground ml-2">{city.country}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

