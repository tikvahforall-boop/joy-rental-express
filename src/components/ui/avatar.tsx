"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

function Avatar({ className, src, alt, name, size = "md", ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const fallback = name ? getInitials(name) : "?";

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-900 font-medium",
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={alt || name || "Avatar"}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </div>
  );
}

export { Avatar };
