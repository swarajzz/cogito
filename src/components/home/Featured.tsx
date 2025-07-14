"use client";

import FeaturedList from "@/src/components/home/FeaturedList";
import { FeaturedListSkeleton } from "@/src/components/home/FeaturedListSkeleton";
import { Button } from "@/src/components/ui/button";
import { maps } from "@/src/server/db/schema/maps";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

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

const Featured = ({
  featuredMapsPromise,
}: {
  featuredMapsPromise: Promise<typeof maps.$inferSelect[]>;
}) => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
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

        <Suspense fallback={<FeaturedListSkeleton />}>
          <FeaturedList featuredMapsPromise={featuredMapsPromise} />
        </Suspense>
      </div>
    </div>
  );
};

export default Featured;
