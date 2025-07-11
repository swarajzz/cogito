"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ConceptMap } from "@/src/components/concept-map";
import { MapCard } from "@/src/components/MapCard";
import { CreateMapModal } from "@/src/components/CreateMapModal";
import {
  Brain,
  Sparkles,
  Plus,
  Search,
  Grid3X3,
  List,
  Clock,
  Star,
  TrendingUp,
  Users,
  Globe,
  ArrowRight,
} from "lucide-react";
import { sampleExistentialismMap } from "@/src/lib/sample-data";
import Link from "next/link";
import Script from "next/script";

const mockUser = null;
const mockUserMaps = [
  {
    id: "1",
    title: "Renaissance Art Movement",
    description:
      "Exploring the key figures, works, and cultural impact of Renaissance art",
    nodeCount: 24,
    edgeCount: 45,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isPublic: true,
    tags: ["Art", "History", "Culture"],
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
    isPublic: false,
    tags: ["Technology", "AI", "Computer Science"],
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Climate Change Science",
    description:
      "Understanding the causes, effects, and solutions to climate change",
    nodeCount: 31,
    edgeCount: 58,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15",
    isPublic: true,
    tags: ["Science", "Environment", "Policy"],
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
];

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!mockUser);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "size">("recent");

  const filteredMaps = mockUserMaps
    .filter(
      (map) =>
        map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        map.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        map.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "size":
          return b.nodeCount - a.nodeCount;
        case "recent":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

  if (selectedMap) {
    return (
      <div className="h-screen">
        <div className="bg-white/80 backdrop-blur-md border-b border-surface/50 px-4 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-textPrimary">
                {selectedMap.title}
              </h2>
              <p className="text-textSecondary">{selectedMap.description}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedMap(null)}
              className="border-2 hover:bg-surface/50"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        <ConceptMap data={selectedMap} />
      </div>
    );
  }

  return (
    <>
      <Script src="https://js.puter.com/v2" />
      <main className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20">
        <header className="bg-white/80 backdrop-blur-md border-b border-surface/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-glow">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Cogito
                  </h1>
                  <p className="text-xs text-textSecondary">
                    AI Knowledge Mapping
                  </p>
                </div>
              </div>
              <nav className="flex items-center gap-3">
                <Link href="/explore">
                  <Button
                    variant="ghost"
                    className="text-textSecondary hover:text-textPrimary"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Explore Public Maps
                  </Button>
                </Link>
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      className="text-textSecondary hover:text-textPrimary"
                    >
                      Settings
                    </Button>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Map
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="text-textSecondary hover:text-textPrimary"
                    >
                      Sign In
                    </Button>
                    <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg">
                      Get Started
                    </Button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header>

        {isLoggedIn ? (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="font-heading text-3xl font-bold text-textPrimary mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-textSecondary text-lg">
                You have {mockUserMaps.length} concept maps. Ready to explore or
                create something new?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-card border border-surface/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-textSecondary text-sm">Total Maps</p>
                    <p className="text-2xl font-bold text-textPrimary">
                      {mockUserMaps.length}
                    </p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Brain className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-card border border-surface/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-textSecondary text-sm">Public Maps</p>
                    <p className="text-2xl font-bold text-textPrimary">
                      {mockUserMaps.filter((m) => m.isPublic).length}
                    </p>
                  </div>
                  <div className="p-3 bg-success-100 rounded-lg">
                    <Globe className="h-6 w-6 text-success-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-card border border-surface/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-textSecondary text-sm">Total Nodes</p>
                    <p className="text-2xl font-bold text-textPrimary">
                      {mockUserMaps.reduce(
                        (sum, map) => sum + map.nodeCount,
                        0
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-accent-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-card border border-surface/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-textSecondary text-sm">This Month</p>
                    <p className="text-2xl font-bold text-textPrimary">2</p>
                  </div>
                  <div className="p-3 bg-info-100 rounded-lg">
                    <Clock className="h-6 w-6 text-info-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-surface/50 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="font-heading text-xl font-semibold text-textPrimary">
                  Your Concept Maps
                </h3>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-textSecondary" />
                    <input
                      type="text"
                      placeholder="Search maps..."
                      className="pl-10 pr-4 py-2 border border-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/50"
                  >
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                    <option value="size">Size</option>
                  </select>

                  <div className="flex border border-surface rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-primary-100 text-primary-600"
                          : "bg-white/50 text-textSecondary"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-primary-100 text-primary-600"
                          : "bg-white/50 text-textSecondary"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {filteredMaps.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredMaps.map((map) => (
                    <MapCard
                      key={map.id}
                      map={map}
                      viewMode={viewMode}
                      onSelect={() => setSelectedMap(map)}
                      showActions={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-textSecondary mx-auto mb-4 opacity-50" />
                  <h4 className="font-medium text-textPrimary mb-2">
                    No maps found
                  </h4>
                  <p className="text-textSecondary mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Create your first concept map to get started"}
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-primary-500 to-primary-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Map
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Transform Knowledge into Visual Maps
                </div>
                <h2 className="font-heading text-5xl font-bold text-textPrimary mb-6 leading-tight">
                  Discover Connections in
                  <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent block">
                    Any Knowledge Domain
                  </span>
                </h2>
                <p className="text-xl text-textSecondary mb-8 leading-relaxed max-w-3xl mx-auto">
                  Create interactive concept maps powered by AI. Explore
                  relationships between ideas, people, events, and concepts
                  across any field of knowledge.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setIsLoggedIn(true)}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 h-14 text-lg font-semibold shadow-lg px-8"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Creating Maps
                  </Button>
                  <Link href="/explore">
                    <Button
                      variant="outline"
                      className="h-14 px-8 border-2 hover:bg-surface/50 text-lg bg-transparent"
                    >
                      <Globe className="mr-2 h-5 w-5" />
                      Explore Public Maps
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-elevated border border-surface/50 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-heading text-2xl font-semibold text-textPrimary mb-2">
                      Featured Knowledge Maps
                    </h3>
                    <p className="text-textSecondary">
                      Discover what others are exploring
                    </p>
                  </div>
                  <Link href="/explore">
                    <Button
                      variant="ghost"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockUserMaps
                    .filter((map) => map.isPublic)
                    .map((map) => (
                      <MapCard
                        key={map.id}
                        map={map}
                        viewMode="grid"
                        onSelect={() => setSelectedMap(map)}
                        showActions={false}
                      />
                    ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Brain className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-textSecondary leading-relaxed">
                    Advanced AI identifies key concepts, relationships, and
                    structures in any knowledge domain
                  </p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Users className="h-8 w-8 text-accent-600" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
                    Collaborative Learning
                  </h3>
                  <p className="text-textSecondary leading-relaxed">
                    Share your maps publicly, explore others' work, and build
                    knowledge together
                  </p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-success-100 to-success-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Star className="h-8 w-8 text-success-600" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
                    Interactive Exploration
                  </h3>
                  <p className="text-textSecondary leading-relaxed">
                    Navigate complex topics with interactive visualizations and
                    detailed insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <CreateMapModal
            onClose={() => setShowCreateModal(false)}
            onMapCreated={(mapData) => {
              setSelectedMap(mapData);
              setShowCreateModal(false);
            }}
          />
        )}
      </main>
    </>
  );
}
