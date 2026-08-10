"use client";

import { WheelbaseScript } from "./wheelbase-script";

interface WheelbaseListingProps {
  dealerId: string;
  rentalId: string;
  showReviews?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  surfaceColor?: string;
  className?: string;
}

export function WheelbaseListing({
  dealerId,
  rentalId,
  showReviews,
  primaryColor = "#16a34a",
  secondaryColor,
  textColor,
  surfaceColor,
  className,
}: WheelbaseListingProps) {
  return (
    <div className={className}>
      <WheelbaseScript />
      <listing-details
        dealer-id={dealerId}
        rental-id={rentalId}
        primary-color={primaryColor}
        {...(showReviews && { "show-reviews": "true" })}
        {...(secondaryColor && { "secondary-color": secondaryColor })}
        {...(textColor && { "text-color": textColor })}
        {...(surfaceColor && { "surface-color": surfaceColor })}
      />
    </div>
  );
}
