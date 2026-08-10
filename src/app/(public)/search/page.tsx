export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { SearchBar } from "./search-bar";
import { searchVehicles, getAvailableMakes, type SearchFilters as Filters } from "@/lib/services/vehicle-service";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: Filters = {
    location: typeof params.location === "string" ? params.location : undefined,
    pickupDate: typeof params.pickupDate === "string" ? params.pickupDate : undefined,
    returnDate: typeof params.returnDate === "string" ? params.returnDate : undefined,
    category: params.category,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    make: params.make,
    transmission: params.transmission,
    fuelType: params.fuelType,
    minSeats: params.minSeats ? Number(params.minSeats) : undefined,
    features: params.features,
    instantBook: params.instantBook === "true",
    deliveryAvailable: params.deliveryAvailable === "true",
    minRating: params.minRating ? Number(params.minRating) : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
    page: params.page ? Number(params.page) : 1,
  };

  const [result, makes] = await Promise.all([
    searchVehicles(filters),
    getAvailableMakes(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
          <Suspense>
            <SearchFilters makes={makes} />
          </Suspense>

          <Suspense>
            <SearchResults result={result} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
