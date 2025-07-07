"use client"

import { useState } from "react"
import { Search, Filter, ZoomIn, ZoomOut, Maximize, Layers } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Label } from "@/src/components/ui/label"

interface MapControlsProps {
  disciplines: string[]
  filteredDisciplines: string[]
  setFilteredDisciplines: (disciplines: string[]) => void
  zoomLevel: number
  searchTerm: string
  setSearchTerm: (term: string) => void
  complexity: string
  setComplexity: (complexity: string) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitView?: () => void
}

export function MapControls({
  disciplines,
  filteredDisciplines,
  setFilteredDisciplines,
  zoomLevel,
  searchTerm,
  setSearchTerm,
  complexity,
  setComplexity,
  onZoomIn,
  onZoomOut,
  onFitView,
}: MapControlsProps) {
  const [showFilters, setShowFilters] = useState(false)

  const toggleDiscipline = (discipline: string) => {
    if (filteredDisciplines.includes(discipline)) {
      setFilteredDisciplines(filteredDisciplines.filter((d) => d !== discipline))
    } else {
      setFilteredDisciplines([...filteredDisciplines, discipline])
    }
  }

  return (
    <div className="bg-white p-3 rounded-card shadow-card flex flex-col gap-3 min-w-[280px]">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search nodes..."
            className="pl-8 pr-3 py-1.5 text-sm border border-surface rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className={`p-1.5 rounded-md transition-colors ${showFilters ? "bg-primary text-white" : "hover:bg-surface"}`}
          onClick={() => setShowFilters(!showFilters)}
          title="Filter by discipline"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Complexity Controls */}
      <div className="border-t border-surface pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-textPrimary">Complexity</span>
        </div>
        <RadioGroup value={complexity} onValueChange={setComplexity} className="flex gap-3">
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="minimal" id="map-minimal" className="h-3 w-3" />
            <Label htmlFor="map-minimal" className="text-xs cursor-pointer">
              Minimal
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="moderate" id="map-moderate" className="h-3 w-3" />
            <Label htmlFor="map-moderate" className="text-xs cursor-pointer">
              Moderate
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="thorough" id="map-thorough" className="h-3 w-3" />
            <Label htmlFor="map-thorough" className="text-xs cursor-pointer">
              Thorough
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Discipline Filters */}
      {showFilters && disciplines.length > 0 && (
        <div className="border-t border-surface pt-3">
          <div className="text-sm font-medium text-textPrimary mb-2">Filter by Discipline</div>
          <div className="flex flex-wrap gap-1">
            {disciplines.map((discipline) => (
              <button
                key={discipline}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  filteredDisciplines.includes(discipline)
                    ? "bg-primary text-white"
                    : "bg-surface text-textSecondary hover:bg-surface/80"
                }`}
                onClick={() => toggleDiscipline(discipline)}
              >
                {discipline}
              </button>
            ))}
            {filteredDisciplines.length > 0 && (
              <button
                className="px-2 py-1 text-xs rounded-md bg-surface text-textSecondary hover:bg-surface/80"
                onClick={() => setFilteredDisciplines([])}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="flex items-center justify-between border-t border-surface pt-3">
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-md hover:bg-surface transition-colors"
            onClick={onZoomOut ?? (() => {})}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4 text-textSecondary" />
          </button>
          <span className="text-xs text-textSecondary w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
          <button
            className="p-1.5 rounded-md hover:bg-surface transition-colors"
            onClick={onZoomIn ?? (() => {})}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4 text-textSecondary" />
          </button>
        </div>
        <button
          className="p-1.5 rounded-md hover:bg-surface transition-colors"
          onClick={onFitView ?? (() => {})}
          title="Fit view"
        >
          <Maximize className="h-4 w-4 text-textSecondary" />
        </button>
      </div>
    </div>
  )
}
