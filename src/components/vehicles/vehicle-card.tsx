"use client";

import Link from "next/link";
import { Heart, Star, Users, Fuel, Gauge, Zap, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { VehicleResult } from "@/lib/services/vehicle-types";

const categoryGradients: Record<string, string> = {
  economy: "from-neutral-400 to-neutral-800",
  suv: "from-blue-400 to-indigo-600",
  luxury: "from-neutral-400 to-yellow-600",
  electric: "from-cyan-400 to-teal-600",
  sports: "from-red-400 to-rose-600",
  van: "from-purple-400 to-violet-600",
  truck: "from-orange-400 to-neutral-600",
  family: "from-pink-400 to-fuchsia-600",
};

const categoryEmoji: Record<string, string> = {
  economy: "🚗",
  suv: "🚙",
  luxury: "✨",
  electric: "⚡",
  sports: "🏎️",
  van: "🚐",
  truck: "🛻",
  family: "👨‍👩‍👧‍👦",
};

const fuelLabels: Record<string, string> = {
  GASOLINE: "Gas",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  HYBRID: "Hybrid",
  PLUG_IN_HYBRID: "PHEV",
};

interface VehicleCardProps {
  vehicle: VehicleResult;
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imgError, setImgError] = useState(false);

  const gradient = categoryGradients[vehicle.category] || "from-gray-400 to-gray-600";
  const emoji = categoryEmoji[vehicle.category] || "🚗";

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className={cn(
        "group block rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="relative">
        {vehicle.imageUrl && !imgError ? (
          <div className="h-48 overflow-hidden rounded-t-xl">
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-48 items-center justify-center rounded-t-xl bg-gradient-to-br",
              gradient
            )}
          >
            <span className="text-6xl drop-shadow-lg" role="img" aria-label={vehicle.category}>
              {emoji}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </button>

        {vehicle.instantBook && (
          <div className="absolute left-3 top-3">
            <Badge className="bg-neutral-500 text-white border-0">
              <Zap className="mr-1 h-3 w-3" />
              Instant Book
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-neutral-800 transition-colors">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
        </div>

        <div className="mb-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-neutral-400 text-neutral-400" />
          <span className="text-sm font-medium text-gray-900">{vehicle.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({vehicle.reviewCount})</span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {vehicle.seats} seats
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {vehicle.transmission === "AUTOMATIC" ? "Auto" : "Manual"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            {fuelLabels[vehicle.fuelType]}
          </span>
        </div>

        <div className="flex items-end justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <Avatar name={vehicle.hostName} size="sm" />
            <span className="text-xs text-gray-500">{vehicle.hostName}</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(vehicle.dailyPrice)}
            </span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="h-3 w-3" />
          {vehicle.city}, {vehicle.state}
        </div>
      </div>
    </Link>
  );
}
