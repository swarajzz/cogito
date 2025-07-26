"use client";

import { Button } from "@/src/components/ui/button";
import { MapDbType } from "@/src/zod-schemas/map";
import {
  MoreHorizontal,
  Eye,
  Heart,
  Share2,
  Edit,
  Trash2,
  Globe,
  Lock,
  Calendar,
  User,
  Network,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MapCardProps {
  map: MapDbType;
  viewMode: "grid" | "list";
  onSelect: () => void;
  showActions?: boolean;
  showStats?: boolean;
}

export function MapCard({
  map,
  viewMode,
  onSelect,
  showActions = false,
  showStats = false,
}: MapCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const pathName = usePathname();
  const mapData = pathName === "/" ? map.mapData : map;

  if (viewMode === "list") {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-surface/50 p-6 hover:shadow-elevated transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={onSelect}>
            <div className="flex items-start gap-4">
              <div className="w-20 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Network className="h-8 w-8 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-heading text-lg font-semibold text-textPrimary hover:text-primary-600 transition-colors">
                    {map.title}
                  </h3>
                  {map.isPublic ? (
                    <Globe className="h-4 w-4 text-success-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-textSecondary" />
                  )}
                </div>
                <p className="text-textSecondary text-sm mb-3 line-clamp-2">
                  {map.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-textSecondary">
                  <span className="flex items-center gap-1">
                    <Network className="h-3 w-3" />
                    {map.nodeCount} nodes • {map.edgeCount} connections
                  </span>
                  {map.author && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {map.author}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(map.updatedAt).toLocaleDateString()}
                  </span>
                  {showStats && (
                    <>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {map.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {map.views}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {showMenu && (
                <div className="absolute right-0 top-10 bg-white border border-surface rounded-lg shadow-elevated p-2 z-10 min-w-[120px]">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface rounded-md flex items-center gap-2">
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface rounded-md flex items-center gap-2">
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface rounded-md flex items-center gap-2 text-red-600">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-4">
          {mapData.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-surface/50 overflow-hidden hover:shadow-elevated transition-all duration-200 group">
      <div className="cursor-pointer" onClick={onSelect}>
        <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden">
          <Network className="h-16 w-16 text-primary-600 opacity-50" />
          <div className="absolute top-3 right-3">
            {map.isPublic ? (
              <div className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Public
              </div>
            ) : (
              <div className="bg-surface text-textSecondary px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Private
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-heading text-lg font-semibold text-textPrimary mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
            {map.title}
          </h3>
          <p className="text-textSecondary text-sm mb-4 line-clamp-2">
            {map.description}
          </p>

          <div className="flex items-center justify-between text-xs text-textSecondary mb-4">
            <span>
              {map.nodeCount} nodes • {map.edgeCount} connections
            </span>
            <span>{new Date(map.updatedAt).toLocaleDateString()}</span>
          </div>

          {map.author && (
            <div className="flex items-center gap-2 text-xs text-textSecondary mb-4">
              <User className="h-3 w-3" />
              <span>by {map.author}</span>
            </div>
          )}

          {showStats && (
            <div className="flex items-center gap-4 text-xs text-textSecondary mb-4">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {map.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {map.views}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {mapData.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {mapData.tags?.length > 3 && (
              <span className="px-2 py-1 bg-surface text-textSecondary text-xs rounded-full">
                +{mapData.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="px-6 pb-4 flex justify-between items-center border-t border-surface/50 pt-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
