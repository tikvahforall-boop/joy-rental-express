import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type WheelbaseHTMLAttributes<T> = DetailedHTMLProps<HTMLAttributes<T>, T>;

interface WheelbaseStoreAttributes {
  "dealer-id"?: string;
  "hide-filters"?: string;
  "hide-hero"?: string;
  "hide-locale-selector"?: string;
  "hide-age-verification"?: string;
  "show-reviews"?: string;
  "background-color"?: string;
  "visible-filters"?: string;
  "visible-nested-filters"?: string;
  locations?: string;
  locale?: string;
  "store-type"?: string;
  "primary-color"?: string;
  "secondary-color"?: string;
  "text-color"?: string;
  "text-secondary-color"?: string;
  "surface-color"?: string;
  "segment-token"?: string;
  "google-tag-manager-id"?: string;
  "google-analytics-id"?: string;
  "no-default-font"?: string;
  debug?: string;
}

interface WheelbaseRentalsListAttributes {
  "dealer-id"?: string;
  filters?: string;
  locations?: string;
  locale?: string;
  "store-type"?: string;
  "primary-color"?: string;
  "secondary-color"?: string;
  "text-color"?: string;
  "surface-color"?: string;
}

interface ListingDetailsAttributes {
  "dealer-id"?: string;
  "rental-id"?: string;
  "show-reviews"?: string;
  "primary-color"?: string;
  "secondary-color"?: string;
  "text-color"?: string;
  "surface-color"?: string;
}

interface LandingWidgetAttributes {
  "target-url"?: string;
  layout?: string;
  title?: string;
  subtitle?: string;
  "button-label"?: string;
  "show-times"?: string;
  "pickup-time-start"?: string;
  "pickup-time-end"?: string;
  "return-time-start"?: string;
  "return-time-end"?: string;
  "calendar-variant"?: string;
  "primary-color"?: string;
  "primary-hover-color"?: string;
  "primary-foreground-color"?: string;
  "surface-color"?: string;
  radius?: string;
  locale?: string;
  children?: ReactNode;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "wheelbase-store": WheelbaseHTMLAttributes<HTMLElement> & WheelbaseStoreAttributes;
      "wheelbase-rentals-list": WheelbaseHTMLAttributes<HTMLElement> & WheelbaseRentalsListAttributes;
      "listing-details": WheelbaseHTMLAttributes<HTMLElement> & ListingDetailsAttributes;
      "landing-widget": WheelbaseHTMLAttributes<HTMLElement> & LandingWidgetAttributes;
    }
  }
}

export {};
