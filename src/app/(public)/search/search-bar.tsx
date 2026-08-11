"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [pickupDate, setPickupDate] = useState(searchParams.get("pickupDate") || "");
  const [returnDate, setReturnDate] = useState(searchParams.get("returnDate") || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }
    if (pickupDate) {
      params.set("pickupDate", pickupDate);
    } else {
      params.delete("pickupDate");
    }
    if (returnDate) {
      params.set("returnDate", returnDate);
    } else {
      params.delete("returnDate");
    }
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="City, airport, or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
          />
        </div>
      </div>

      <div className="flex flex-1 gap-2">
        <div className="flex-1">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-700 focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-700 focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
            />
          </div>
        </div>
      </div>

      <Button type="submit" size="md">
        <Search className="mr-1.5 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
