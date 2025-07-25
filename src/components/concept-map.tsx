"use client";

import { Button } from "@/src/components/ui/button";
import { D3ConceptMap } from "./d3-concept-map";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { MapDbType, MapFullType } from "@/src/zod-schemas/map";

export function ConceptMap({ data }: { data: MapDbType }) {
  const router = useRouter();

  return (
    <div className="h-screen">
      <div className="bg-white/80 backdrop-blur-md border-b border-surface/50 px-4 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-textPrimary">
              {data.title}
            </h2>
            <p className="text-textSecondary">{data.description}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-2 hover:bg-surface/50"
          >
            <MoveLeft />
            Back
          </Button>
        </div>
      </div>
      <D3ConceptMap data={data.mapData} />
    </div>
  );
}
