"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { src: string; alt?: string }[];
  aspectRatio?: "video" | "square" | "wide";
}

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[2/1]",
};

function ImageGallery({
  images,
  aspectRatio = "video",
  className,
  ...props
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (!images.length) return null;

  const goTo = (index: number) => {
    setActiveIndex(index);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-gray-100",
          aspectClasses[aspectRatio]
        )}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Image gallery"
        aria-roledescription="carousel"
      >
        <img
          src={images[activeIndex].src}
          alt={images[activeIndex].alt || `Image ${activeIndex + 1}`}
          className="h-full w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm backdrop-blur-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-800"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm backdrop-blur-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-800"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-800",
                index === activeIndex
                  ? "border-neutral-800 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <img
                src={image.src}
                alt={image.alt || `Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { ImageGallery };
