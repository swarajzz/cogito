import { MapCard } from "@/src/components/MapCard";
import { maps_table as mapsSchema } from "@/src/server/db/schema/map-schema";
import { MapDbType } from "@/src/zod-schemas/map";
import { useRouter } from "next/navigation";
import React, { Suspense, use } from "react";

const FeaturedList = ({
  featuredMapsPromise,
}: {
  featuredMapsPromise: Promise<MapDbType[]>;
}) => {
  const router = useRouter();
  const featuredMaps = use(featuredMapsPromise);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredMaps
        .filter((map) => map.isPublic)
        .map((map) => (
          <MapCard key={map.id} map={map} viewMode="grid" showActions={false} />
        ))}
    </div>
  );
};

export default FeaturedList;
