"use client";

import { WheelbaseScript } from "./wheelbase-script";

interface WheelbaseStoreProps {
  dealerId: string;
  hideFilters?: boolean;
  hideHero?: boolean;
  hideLocaleSelector?: boolean;
  hideAgeVerification?: boolean;
  showReviews?: boolean;
  storeType?: "rv" | "auto";
  locations?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  surfaceColor?: string;
  locale?: string;
  visibleFilters?: string;
  visibleNestedFilters?: string;
  className?: string;
}

export function WheelbaseStore({
  dealerId,
  hideFilters,
  hideHero,
  hideLocaleSelector,
  hideAgeVerification,
  showReviews,
  storeType = "auto",
  locations,
  primaryColor = "#121212",
  secondaryColor = "#525252",
  textColor,
  surfaceColor,
  locale = "en-us",
  visibleFilters,
  visibleNestedFilters,
  className,
}: WheelbaseStoreProps) {
  return (
    <div className={className}>
      <WheelbaseScript />
      <wheelbase-store
        dealer-id={dealerId}
        store-type={storeType}
        locale={locale}
        primary-color={primaryColor}
        secondary-color={secondaryColor}
        {...(textColor && { "text-color": textColor })}
        {...(surfaceColor && { "surface-color": surfaceColor })}
        {...(hideFilters && { "hide-filters": "true" })}
        {...(hideHero && { "hide-hero": "true" })}
        {...(hideLocaleSelector && { "hide-locale-selector": "true" })}
        {...(hideAgeVerification && { "hide-age-verification": "true" })}
        {...(showReviews && { "show-reviews": "true" })}
        {...(locations && { locations })}
        {...(visibleFilters && { "visible-filters": visibleFilters })}
        {...(visibleNestedFilters && { "visible-nested-filters": visibleNestedFilters })}
      />
    </div>
  );
}
