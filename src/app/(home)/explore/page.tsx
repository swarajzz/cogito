"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { MapCard } from "@/src/components/MapCard"
import { ConceptMap } from "@/src/components/concept-map"
import { Search, Filter, Grid3X3, List, Brain, ArrowLeft, Globe, Tag } from "lucide-react"
import { sampleExistentialismMap } from "@/src/lib/sample-data"
import Link from "next/link"

const mockPublicMaps = [
  {
    id: "1",
    title: "Renaissance Art Movement",
    description: "Exploring the key figures, works, and cultural impact of Renaissance art",
    nodeCount: 24,
    edgeCount: 45,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isPublic: true,
    tags: ["Art", "History", "Culture"],
    author: "Dr. Sarah Chen",
    likes: 156,
    views: 1240,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    description: "Core concepts, algorithms, and applications in modern ML",
    nodeCount: 18,
    edgeCount: 32,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    isPublic: true,
    tags: ["Technology", "AI", "Computer Science"],
    author: "Prof. Michael Rodriguez",
    likes: 203,
    views: 1890,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Climate Change Science",
    description: "Understanding the causes, effects, and solutions to climate change",
    nodeCount: 31,
    edgeCount: 58,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15",
    isPublic: true,
    tags: ["Science", "Environment", "Policy"],
    author: "Dr. Emma Thompson",
    likes: 89,
    views: 756,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "Ancient Greek Philosophy",
    description: "Major philosophers, schools of thought, and their lasting influence",
    nodeCount: 28,
    edgeCount: 52,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
    isPublic: true,
    tags: ["Philosophy", "History", "Ancient Greece"],
    author: "Prof. James Wilson",
    likes: 134,
    views: 982,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "World War II Timeline",
    description: "Key events, battles, and turning points of the Second World War",
    nodeCount: 42,
    edgeCount: 78,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
    isPublic: true,
    tags: ["History", "War", "20th Century"],
    author: "Dr. Robert Kim",
    likes: 267,
    views: 2150,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    title: "Quantum Physics Basics",
    description: "Fundamental principles and phenomena in quantum mechanics",
    nodeCount: 22,
    edgeCount: 38,
    createdAt: "2024-01-14",
    updatedAt: "2024-01-21",
    isPublic: true,
    tags: ["Physics", "Science", "Quantum"],
    author: "Dr. Lisa Park",
    likes: 178,
    views: 1456,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

const allTags = Array.from(new Set(mockPublicMaps.flatMap((map) => map.tags)))

export default function ExplorePage() {
  const [selectedMap, setSelectedMap] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "trending">("popular")
  const [showFilters, setShowFilters] = useState(false)

  const filteredMaps = mockPublicMaps
    .filter((map) => {
      const matchesSearch =
        map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        map.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        map.author.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => map.tags.includes(tag))

      return matchesSearch && matchesTags
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "trending":
          return b.likes + b.views * 0.1 - (a.likes + a.views * 0.1)
        case "popular":
        default:
          return b.likes - a.likes
      }
    })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  if (selectedMap) {
    return (
      <div className="h-screen">
        <div className="bg-white/80 backdrop-blur-md border-b border-surface/50 px-4 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-textPrimary">{selectedMap.title}</h2>
              <p className="text-textSecondary">
                by {selectedMap.author} • {selectedMap.likes} likes • {selectedMap.views} views
              </p>
            </div>
            <Button variant="outline" onClick={() => setSelectedMap(null)} className="border-2 hover:bg-surface/50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Explore
            </Button>
          </div>
        </div>
        <ConceptMap data={sampleExistentialismMap} />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20">
{/* 
      <header className="bg-white/80 backdrop-blur-md border-b border-surface/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link href="/">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-glow">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      Cogito
                    </h1>
                    <p className="text-xs text-textSecondary">AI Knowledge Mapping</p>
                  </div>
                </div>
              </Link>
            </div>
            <nav className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" className="text-textSecondary hover:text-textPrimary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" className="text-textSecondary hover:text-textPrimary">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header> */}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-8 w-8 text-primary-600" />
            <h2 className="font-heading text-3xl font-bold text-textPrimary">Explore Public Maps</h2>
          </div>
          <p className="text-textSecondary text-lg max-w-2xl">
            Discover knowledge maps created by our community. From scientific breakthroughs to historical events,
            explore how others visualize complex topics.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-card border border-surface/50 text-center">
            <div className="text-2xl font-bold text-primary-600">{mockPublicMaps.length}</div>
            <div className="text-sm text-textSecondary">Public Maps</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-card border border-surface/50 text-center">
            <div className="text-2xl font-bold text-accent-600">
              {mockPublicMaps.reduce((sum, map) => sum + map.likes, 0)}
            </div>
            <div className="text-sm text-textSecondary">Total Likes</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-card border border-surface/50 text-center">
            <div className="text-2xl font-bold text-success-600">
              {mockPublicMaps.reduce((sum, map) => sum + map.views, 0)}
            </div>
            <div className="text-sm text-textSecondary">Total Views</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-card border border-surface/50 text-center">
            <div className="text-2xl font-bold text-info-600">{allTags.length}</div>
            <div className="text-sm text-textSecondary">Categories</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-surface/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-textSecondary" />
              <input
                type="text"
                placeholder="Search maps, authors, topics..."
                className="w-full pl-10 pr-4 py-3 border border-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/50"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="trending">Trending</option>
              </select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`${showFilters ? "bg-primary-50 border-primary-200" : ""}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex border border-surface rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${viewMode === "grid" ? "bg-primary-100 text-primary-600" : "bg-white/50 text-textSecondary"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${viewMode === "list" ? "bg-primary-100 text-primary-600" : "bg-white/50 text-textSecondary"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-surface/50">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-textSecondary" />
                <span className="font-medium text-textPrimary">Filter by Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-primary-100 text-primary-700 border border-primary-200"
                        : "bg-surface text-textSecondary hover:bg-surface/80 border border-surface"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1 rounded-full text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-textSecondary">
            Showing {filteredMaps.length} of {mockPublicMaps.length} maps
            {selectedTags.length > 0 && <span> in {selectedTags.join(", ")}</span>}
          </p>
        </div>

        {filteredMaps.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredMaps.map((map) => (
              <MapCard
                key={map.id}
                map={map}
                viewMode={viewMode}
                onSelect={() => setSelectedMap(map)}
                showActions={false}
                showStats={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Globe className="h-16 w-16 text-textSecondary mx-auto mb-4 opacity-50" />
            <h4 className="font-medium text-textPrimary mb-2">No maps found</h4>
            <p className="text-textSecondary mb-4">Try adjusting your search terms or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedTags([])
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
