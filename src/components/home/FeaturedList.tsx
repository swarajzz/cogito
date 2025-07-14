import { MapCard } from "@/src/components/MapCard";
import { maps } from "@/src/server/db/schema/maps";
import { useRouter } from "next/navigation";
import React, { Suspense, use } from "react";

const FeaturedList = ({
  featuredMapsPromise,
}: {
  featuredMapsPromise: Promise<(typeof maps.$inferSelect)[]>;
}) => {
  const router = useRouter();
  const featuredMaps = use(featuredMapsPromise);

  function handleMapSelect(map: typeof maps.$inferSelect) {
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
