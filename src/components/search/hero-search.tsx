"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const WheelbaseLanding = dynamic(
  () =>
    import("@/components/wheelbase/wheelbase-landing").then(
      (mod) => mod.WheelbaseLanding
    ),
  { ssr: false }
);

export function HeroSearch() {
  const dealerId = process.env.NEXT_PUBLIC_WHEELBASE_DEALER_ID;

  if (dealerId) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <WheelbaseLanding
          targetUrl="/book"
          layout="horizontal"
          buttonLabel="Check Availability"
          showTimes
          pickupTimeStart="08:00"
          pickupTimeEnd="18:00"
          returnTimeStart="08:00"
          returnTimeEnd="18:00"
          primaryColor="#121212"
          primaryHoverColor="#000000"
          primaryForegroundColor="#ffffff"
          surfaceColor="#ffffff"
          radius="soft"
          footer={
            <div slot="footer" style={{ textAlign: "center", fontSize: "13px", color: "#dcfce7" }}>
              Fully insured trips · Free cancellation within 24h
            </div>
          }
        />
      </div>
    );
  }

  return <FallbackSearch />;
}

function FallbackSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (pickupDate) params.set("pickupDate", pickupDate);
    if (returnDate) params.set("returnDate", returnDate);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-3 shadow-xl md:p-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-2">
        <div className="flex-1">
          <label htmlFor="hero-location" className="mb-1.5 block text-xs font-medium text-gray-500">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="hero-location"
              type="text"
              placeholder="City, airport, or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
            />
          </div>
        </div>

        <div className="flex flex-1 gap-2">
          <div className="flex-1">
            <label htmlFor="hero-pickup" className="mb-1.5 block text-xs font-medium text-gray-500">
              Pickup
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="hero-pickup"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-700 focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
              />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="hero-return" className="mb-1.5 block text-xs font-medium text-gray-500">
              Return
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="hero-return"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-700 focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
              />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="h-11 px-8">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}
