"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  pickupDate?: string;
  returnDate?: string;
  onPickupChange?: (date: string) => void;
  onReturnChange?: (date: string) => void;
  pickupLabel?: string;
  returnLabel?: string;
  minDate?: string;
  error?: string;
}

function DateRangePicker({
  pickupDate = "",
  returnDate = "",
  onPickupChange,
  onReturnChange,
  pickupLabel = "Pickup Date",
  returnLabel = "Return Date",
  minDate,
  error,
  className,
  ...props
}: DateRangePickerProps) {
  const today = minDate || new Date().toISOString().split("T")[0];

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {pickupLabel}
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={pickupDate}
              min={today}
              onChange={(e) => onPickupChange?.(e.target.value)}
              className={cn(
                "flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20",
                error && "border-red-500"
              )}
              aria-label={pickupLabel}
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {returnLabel}
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={returnDate}
              min={pickupDate || today}
              onChange={(e) => onReturnChange?.(e.target.value)}
              className={cn(
                "flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20",
                error && "border-red-500"
              )}
              aria-label={returnLabel}
            />
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { DateRangePicker };
