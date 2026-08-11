"use client";

import { WheelbaseScript } from "./wheelbase-script";

interface WheelbaseLandingProps {
  targetUrl: string;
  layout?: "full" | "horizontal" | "compact";
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  showTimes?: boolean;
  pickupTimeStart?: string;
  pickupTimeEnd?: string;
  returnTimeStart?: string;
  returnTimeEnd?: string;
  calendarVariant?: "modal" | "dropdown";
  primaryColor?: string;
  primaryHoverColor?: string;
  primaryForegroundColor?: string;
  surfaceColor?: string;
  radius?: "subtle" | "soft" | "round";
  locale?: string;
  className?: string;
  footer?: React.ReactNode;
}

export function WheelbaseLanding({
  targetUrl,
  layout = "horizontal",
  title,
  subtitle,
  buttonLabel = "Check Availability",
  showTimes,
  pickupTimeStart = "08:00",
  pickupTimeEnd = "18:00",
  returnTimeStart = "08:00",
  returnTimeEnd = "18:00",
  calendarVariant = "modal",
  primaryColor = "#121212",
  primaryHoverColor = "#000000",
  primaryForegroundColor = "#ffffff",
  surfaceColor = "#ffffff",
  radius = "soft",
  locale = "en-us",
  className,
  footer,
}: WheelbaseLandingProps) {
  return (
    <div className={className}>
      <WheelbaseScript />
      <landing-widget
        target-url={targetUrl}
        layout={layout}
        button-label={buttonLabel}
        primary-color={primaryColor}
        primary-hover-color={primaryHoverColor}
        primary-foreground-color={primaryForegroundColor}
        surface-color={surfaceColor}
        radius={radius}
        locale={locale}
        calendar-variant={calendarVariant}
        {...(title && { title })}
        {...(subtitle && { subtitle })}
        {...(showTimes && {
          "show-times": "true",
          "pickup-time-start": pickupTimeStart,
          "pickup-time-end": pickupTimeEnd,
          "return-time-start": returnTimeStart,
          "return-time-end": returnTimeEnd,
        })}
      >
        {footer}
      </landing-widget>
    </div>
  );
}
