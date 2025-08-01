"use client";

import { CreateMapModal } from "@/src/components/CreateMapModal";
import { MapCard } from "@/src/components/MapCard";
import PaginationComponent from "@/src/components/Pagination";
import { Button } from "@/src/components/ui/button";
import SearchInput from "@/src/components/ui/SearchInput";
import { MapDbType } from "@/src/zod-schemas/map";
import { Brain, Clock, Globe, Plus, TrendingUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface PaginatedUserMaps {
  data: MapDbType[];
  paginateData: {
    totalResults: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}

const Workspace = ({ paginatedMaps }: { paginatedMaps: PaginatedUserMaps }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "size">("recent");

  const { data: userMaps, paginateData } = paginatedMaps;

  // const countLastMonth = userMaps.filter(
  //   (map) => map.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  // );

  const filteredMaps = [...userMaps]
    // .filter(
    //   (map) =>
    //     map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     map.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     map.mapData.tags.some((tag) =>
    //       tag.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    // )
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
              <p className="text-2xl font-bold text-textPrimary">
                {/* {countLastMonth.length} */}
              </p>
            </div>
            <div className="p-3 bg-info-100 rounded-lg">
              <Clock className="h-6 w-6 text-info-600" />
            </div>
          </div>
        </div>
      </div>

      <SearchInput
        type="dashboard"
        search={{ term: searchTerm }}
        sort={{
          value: sortBy,
          onChange: setSortBy,
          options: [
            { label: "Recent", value: "recent" },
            { label: "Name", value: "name" },
            { label: "Size", value: "size" },
          ],
        }}
        view={{ mode: viewMode, onChange: setViewMode }}
      />

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

      {showCreateModal && (
        <CreateMapModal
          onClose={() => setShowCreateModal(false)}
          onMapCreated={(mapData) => {
            setShowCreateModal(false);
            // router.push("/map/")
          }}
        />
      )}

      <PaginationComponent paginateData={paginateData} />
    </div>
  );
};

export default Workspace;
