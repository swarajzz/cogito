"use client";
import React from "react";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { MapCard } from "@/src/components/MapCard";
import { Globe } from "lucide-react";
import { MapDbType } from "@/src/zod-schemas/map";
import { DB_TagType } from "@/src/server/db/schema/map-schema";
import PaginationComponent from "@/src/components/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchInput from "@/src/components/ui/SearchInput";

interface PaginatedExploreMaps {
  data: MapDbType[];
  paginateData: {
    totalResults: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}

const Explore = ({
  paginatedExploreMaps,
  tags,
}: {
  paginatedExploreMaps: PaginatedExploreMaps;
  tags: DB_TagType[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "trending">(
    "popular"
  );
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const { data: exploreMaps, paginateData } = paginatedExploreMaps;

  const filteredMaps = [...exploreMaps]
    // .filter((map) => {
    //   const matchesSearch =
    //     map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     map.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     map.author.toLowerCase().includes(searchTerm.toLowerCase());

    //   const matchesTags =
    //     selectedTags.length === 0 ||
    //     selectedTags.some((tag) => map.mapData.tags.includes(tag));

    //   return matchesSearch && matchesTags;
    // })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "trending":
          return b.likes + b.views * 0.1 - (a.likes + a.views * 0.1);
        case "popular":
        default:
          return b.likes - a.likes;
      }
    });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-8 w-8 text-primary-600" />
            <h2 className="font-heading text-3xl font-bold text-textPrimary">
              Explore Public Maps
            </h2>
          </div>
          <p className="text-textSecondary text-lg max-w-2xl">
            Discover knowledge maps created by our community. From scientific
            breakthroughs to historical events, explore how others visualize
            complex topics.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-card border border-surface/50 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {exploreMaps.length}
            </div>
            <div className="text-sm text-textSecondary">Public Maps</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-card border border-surface/50 text-center">
            <div className="text-2xl font-bold text-accent-600">
              {exploreMaps.reduce((sum, map) => sum + map.likes, 0)}
            </div>
            <div className="text-sm text-textSecondary">Total Likes</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-card border border-surface/50 text-center">
            <div className="text-2xl font-bold text-success-600">
              {exploreMaps.reduce((sum, map) => sum + map.views, 0)}
            </div>
            <div className="text-sm text-textSecondary">Total Views</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-card border border-surface/50 text-center">
            <div className="text-2xl font-bold text-info-600">
              {tags.length}
            </div>
            <div className="text-sm text-textSecondary">Categories</div>
          </div>
        </div>

        <SearchInput
          type="explore"
          search={{ term: searchTerm }}
          sort={{
            value: sortBy,
            onChange: setSortBy,
            options: [
              { label: "Popular", value: "popular" },
              { label: "Recent", value: "recent" },
              { label: "Trending", value: "trending" },
            ],
          }}
          view={{ mode: viewMode, onChange: setViewMode }}
        />

        <div className="mb-4">
          <p className="text-textSecondary">
            Showing {filteredMaps.length} of {exploreMaps.length} maps
            {selectedTags.length > 0 && (
              <span> in {selectedTags.join(", ")}</span>
            )}
          </p>
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
                showActions={true}
                showStats={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Globe className="h-16 w-16 text-textSecondary mx-auto mb-4 opacity-50" />
            <h4 className="font-medium text-textPrimary mb-2">No maps found</h4>
            <p className="text-textSecondary mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedTags([]);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <PaginationComponent paginateData={paginateData} />
    </main>
  );
};

export default Explore;
