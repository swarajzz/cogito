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

  function handleMapSelect(map: typeof mapsSchema.$inferSelect) {
    router.push(`/map/${map.id}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredMaps
        .filter((map) => map.isPublic)
        .map((map) => (
          <MapCard
            key={map.id}
            map={map}
            viewMode="grid"
            onSelect={() => handleMapSelect(map)}
            showActions={false}
          />
        ))}
    </div>
  );
};

export default FeaturedList;
