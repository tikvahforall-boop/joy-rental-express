"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Map, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import type { SearchResult } from "@/lib/services/vehicle-types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

interface SearchResultsProps {
  result: SearchResult;
}

export function SearchResults({ result }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "recommended";
  const currentView = searchParams.get("view") || "grid";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/search?${params.toString()}`);
  }

  function goToPage(page: number) {
    updateParam("page", page.toString());
  }

  if (result.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          No vehicles found
        </h3>
        <p className="max-w-md text-gray-500">
          Try adjusting your filters or searching in a different location to find
          available vehicles.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{result.total}</span>{" "}
          {result.total === 1 ? "vehicle" : "vehicles"} available
        </p>

        <div className="flex items-center gap-3">
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="hidden items-center rounded-lg border border-gray-300 sm:flex">
            <button
              type="button"
              onClick={() => updateParam("view", "grid")}
              className={cn(
                "rounded-l-lg px-3 py-1.5 transition-colors",
                currentView === "grid"
                  ? "bg-neutral-50 text-neutral-800"
                  : "text-gray-500 hover:bg-gray-50"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => updateParam("view", "map")}
              className={cn(
                "rounded-r-lg border-l border-gray-300 px-3 py-1.5 transition-colors",
                currentView === "map"
                  ? "bg-neutral-50 text-neutral-800"
                  : "text-gray-500 hover:bg-gray-50"
              )}
              aria-label="Map view"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {currentView === "map" ? (
        <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="text-center">
            <Map className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-600">
              Map view coming soon
            </p>
            <p className="text-sm text-gray-400">
              Switch to grid view to browse vehicles
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {result.vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}

      {result.totalPages > 1 && (
        <nav
          className="mt-8 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={() => goToPage(result.page - 1)}
            disabled={result.page <= 1}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  page === result.page
                    ? "bg-neutral-800 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => goToPage(result.page + 1)}
            disabled={result.page >= result.totalPages}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
