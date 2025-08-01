import { useDebounce } from "@/src/hooks/useDebounceSearch";
import { Grid3X3, List, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface SearchInputProps<TSort extends string> {
  type: "dashboard" | "explore";
  search: {
    term: string;
  };
  sort: {
    value: TSort;
    onChange: (value: TSort) => void;
    options: { label: string; value: TSort }[];
  };
  view: {
    mode: "grid" | "list";
    onChange: (mode: "grid" | "list") => void;
  };
}

export default function SearchInput<TSort extends string>({
  type,
  search,
  sort,
  view,
}: SearchInputProps<TSort>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleSearch(term: string) {
    if (term.length < 3) return;

    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params}`);
  }

  const debouncedSearch = useDebounce(handleSearch, 1000);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-surface/50 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {type === "dashboard" && (
          <h3 className="font-heading text-xl font-semibold text-textPrimary">
            Your Concept Maps
          </h3>
        )}

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search maps, authors, topics..."
            className="w-full pl-10 pr-4 py-3 border border-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/50"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sort.value}
            onChange={(e) => sort.onChange(e.target.value as any)}
            className="px-4 py-3 border border-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white/50"
          >
            {sort.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* 
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`${
                  showFilters ? "bg-primary-50 border-primary-200" : ""
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button> */}

          <div className="flex border border-surface rounded-lg overflow-hidden">
            <button
              onClick={() => view.onChange("grid")}
              className={`p-3 ${
                view.mode === "grid"
                  ? "bg-primary-100 text-primary-600"
                  : "bg-white/50 text-textSecondary"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => view.onChange("list")}
              className={`p-3 ${
                view.mode === "list"
                  ? "bg-primary-100 text-primary-600"
                  : "bg-white/50 text-textSecondary"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* {showFilters && (
            <div className="mt-6 pt-6 border-t border-surface/50">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-textSecondary" />
                <span className="font-medium text-textPrimary">
                  Filter by Category
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-primary-100 text-primary-700 border border-primary-200"
                        : "bg-surface text-textSecondary hover:bg-surface/80 border border-surface"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1 rounded-full text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )} */}
    </div>
  );
}
