import * as React from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

export interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  period?: "day" | "week" | "month";
  originalAmount?: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { price: "text-lg font-semibold", period: "text-xs", original: "text-sm" },
  md: { price: "text-2xl font-bold", period: "text-sm", original: "text-base" },
  lg: { price: "text-3xl font-bold", period: "text-base", original: "text-lg" },
};

function PriceDisplay({
  amount,
  period,
  originalAmount,
  size = "md",
  className,
  ...props
}: PriceDisplayProps) {
  const styles = sizeClasses[size];

  return (
    <div className={cn("inline-flex items-baseline gap-1", className)} {...props}>
      {originalAmount && originalAmount > amount && (
        <span className={cn(styles.original, "text-gray-400 line-through")}>
          {formatCurrency(originalAmount)}
        </span>
      )}
      <span className={cn(styles.price, "text-gray-900")}>
        {formatCurrency(amount)}
      </span>
      {period && (
        <span className={cn(styles.period, "text-gray-500")}>/{period}</span>
      )}
    </div>
  );
}

export { PriceDisplay };
