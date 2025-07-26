"use client";

import { CreateMapModal } from "@/src/components/CreateMapModal";
import { MapCard } from "@/src/components/MapCard";
import { Button } from "@/src/components/ui/button";
import { MapDbType } from "@/src/zod-schemas/map";
import {
  Brain,
  Clock,
  Globe,
  Grid3X3,
  List,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

const Workspace = ({ userMaps }: { userMaps: MapDbType[] }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "size">("recent");

  const filteredMaps = userMaps
    .filter(
      (map) =>
        map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        map.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        map.mapData.tags.some((tag) =>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold text-textPrimary mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-textSecondary text-lg">
          Good to see you again! Let’s pick up where you left off or map
          something fresh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-card border border-surface/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-textSecondary text-sm">Total Maps</p>
              <p className="text-2xl font-bold text-textPrimary">
                {userMaps.length}
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
                {userMaps.filter((m) => m.isPublic).length}
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
                {userMaps.reduce((sum, map) => sum + map.nodeCount, 0)}
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
            <h4 className="font-medium text-textPrimary mb-2">No maps found</h4>
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

      {showCreateModal && (
        <CreateMapModal
          onClose={() => setShowCreateModal(false)}
          onMapCreated={(mapData) => {
            setShowCreateModal(false);
            // router.push("/map/")
          }}
        />
      )}
    </div>
  );
};

export default Workspace;
