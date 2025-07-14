import { Skeleton } from "@/src/components/ui/skeleton";

export function FeaturedListSkeleton() {
  return (
    <div className="flex gap-6 flex-wrap">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="cursor-pointer flex-1" key={index}>
          <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden animate-pulse">
            <div className="h-16 w-16 opacity-50">
              <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="absolute top-3 right-3">
              <div className="bg-gray-200 px-2 py-1 rounded-full text-xs flex items-center gap-1 animate-pulse">
                <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
                <div className="bg-gray-200 rounded-md w-8 h-3 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-200 rounded-md h-6 w-3/4 mb-2 animate-pulse" />
            <div className="bg-gray-200 rounded-md h-4 w-full mb-4 animate-pulse" />
            <div className="bg-gray-200 rounded-md h-4 w-full mb-4 animate-pulse" />
            <div className="flex items-center justify-between text-xs mb-4">
              <div className="bg-gray-200 rounded-md w-24 h-3 animate-pulse" />
              <div className="bg-gray-200 rounded-md w-16 h-3 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-xs mb-4">
              <div className="h-3 w-3">
                <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="bg-gray-200 rounded-md w-32 h-3 animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
