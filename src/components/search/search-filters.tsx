"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VEHICLE_CATEGORIES,
  TRANSMISSION_TYPES,
  FUEL_TYPES,
  VEHICLE_FEATURES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const SEAT_OPTIONS = [
  { value: "2", label: "2+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
  { value: "7", label: "7+" },
];

const RATING_OPTIONS = [
  { value: "4", label: "4+" },
  { value: "4.5", label: "4.5+" },
];

export function SearchFilters({ makes }: { makes: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getParam = useCallback(
    (key: string) => searchParams.get(key) || "",
    [searchParams]
  );

  const getParamArray = useCallback(
    (key: string) => searchParams.getAll(key),
    [searchParams]
  );

  function updateParams(updates: Record<string, string | string[] | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      params.delete(key);
      if (value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, v);
      } else if (value) {
        params.set(key, value);
      }
    }
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  function toggleArrayParam(key: string, value: string) {
    const current = getParamArray(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [key]: next.length > 0 ? next : null });
  }

  function clearAll() {
    const params = new URLSearchParams();
    const location = getParam("location");
    const pickupDate = getParam("pickupDate");
    const returnDate = getParam("returnDate");
    if (location) params.set("location", location);
    if (pickupDate) params.set("pickupDate", pickupDate);
    if (returnDate) params.set("returnDate", returnDate);
    router.push(`/search?${params.toString()}`);
  }

  const hasFilters =
    getParamArray("category").length > 0 ||
    getParam("minPrice") ||
    getParam("maxPrice") ||
    getParamArray("make").length > 0 ||
    getParamArray("transmission").length > 0 ||
    getParamArray("fuelType").length > 0 ||
    getParam("minSeats") ||
    getParamArray("features").length > 0 ||
    getParam("instantBook") ||
    getParam("deliveryAvailable") ||
    getParam("minRating");

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Vehicle Type">
        <div className="space-y-2">
          {VEHICLE_CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={getParamArray("category").includes(cat.value)}
                onChange={() => toggleArrayParam("category", cat.value)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              <span className="text-sm text-gray-700">
                {cat.icon} {cat.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={getParam("minPrice")}
            onChange={(e) => updateParams({ minPrice: e.target.value || null })}
            className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
            min={0}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={getParam("maxPrice")}
            onChange={(e) => updateParams({ maxPrice: e.target.value || null })}
            className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
            min={0}
          />
        </div>
      </FilterSection>

      <FilterSection title="Make">
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {makes.map((make) => (
            <label key={make} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={getParamArray("make").includes(make)}
                onChange={() => toggleArrayParam("make", make)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              <span className="text-sm text-gray-700">{make}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Transmission">
        <div className="space-y-2">
          {TRANSMISSION_TYPES.map((t) => (
            <label key={t.value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={getParamArray("transmission").includes(t.value)}
                onChange={() => toggleArrayParam("transmission", t.value)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              <span className="text-sm text-gray-700">{t.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Fuel Type">
        <div className="space-y-2">
          {FUEL_TYPES.map((f) => (
            <label key={f.value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={getParamArray("fuelType").includes(f.value)}
                onChange={() => toggleArrayParam("fuelType", f.value)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              <span className="text-sm text-gray-700">{f.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Seats">
        <div className="flex flex-wrap gap-2">
          {SEAT_OPTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() =>
                updateParams({
                  minSeats: getParam("minSeats") === s.value ? null : s.value,
                })
              }
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                getParam("minSeats") === s.value
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Features">
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {VEHICLE_FEATURES.map((feature) => (
            <label key={feature} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={getParamArray("features").includes(feature)}
                onChange={() => toggleArrayParam("features", feature)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              <span className="text-sm text-gray-700">{feature}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Booking Options">
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm text-gray-700">Instant Book</span>
            <ToggleSwitch
              checked={getParam("instantBook") === "true"}
              onChange={(v) =>
                updateParams({ instantBook: v ? "true" : null })
              }
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm text-gray-700">Delivery Available</span>
            <ToggleSwitch
              checked={getParam("deliveryAvailable") === "true"}
              onChange={(v) =>
                updateParams({ deliveryAvailable: v ? "true" : null })
              }
            />
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Host Rating">
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() =>
                updateParams({
                  minRating: getParam("minRating") === r.value ? null : r.value,
                })
              }
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                getParam("minRating") === r.value
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              )}
            >
              {r.label} stars
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
            !
          </span>
        )}
      </button>

      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-4">{filterContent}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 top-0 ml-auto w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
            <div className="sticky bottom-0 mt-6 border-t border-gray-200 bg-white pt-4">
              <Button
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">{title}</h4>
      {children}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-green-600" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
