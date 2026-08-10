import * as React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  className,
  ...props
}: StarRatingProps) {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (rating >= i) {
      stars.push(
        <Star
          key={i}
          className={cn(sizeMap[size], "fill-amber-400 text-amber-400")}
        />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <span key={i} className="relative">
          <Star className={cn(sizeMap[size], "text-gray-300")} />
          <StarHalf
            className={cn(sizeMap[size], "absolute left-0 top-0 fill-amber-400 text-amber-400")}
          />
        </span>
      );
    } else {
      stars.push(
        <Star key={i} className={cn(sizeMap[size], "text-gray-300")} />
      );
    }
  }

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of ${max} stars`}
      {...props}
    >
      {stars}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { StarRating };
