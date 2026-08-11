import * as React from "react";
import { cn } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/constants";

type BookingStatus = keyof typeof BOOKING_STATUSES;

const colorMap: Record<string, string> = {
  gray: "bg-gray-100 text-gray-800",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-neutral-100 text-black",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  orange: "bg-orange-100 text-orange-800",
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BookingStatus;
}

function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = BOOKING_STATUSES[status];
  const colorClasses = colorMap[config.color] || colorMap.gray;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClasses,
        className
      )}
      {...props}
    >
      {config.label}
    </span>
  );
}

export { StatusBadge };
export type { BookingStatus };
