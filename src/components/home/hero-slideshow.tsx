"use client";

import { useState, useEffect } from "react";
import { HeroSearch } from "@/components/search/hero-search";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80&auto=format&fit=crop",
    title: "Your Colorado Adventure Starts Here",
    subtitle: "Rent a car and explore the Rocky Mountain State",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop",
    title: "Discover Mountain Majesty",
    subtitle: "From Denver to Aspen, drive through stunning landscapes",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80&auto=format&fit=crop",
    title: "Chase the Perfect View",
    subtitle: "14,000-foot peaks, alpine lakes, and endless horizons await",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80&auto=format&fit=crop",
    title: "Unforgettable Road Trips",
    subtitle: "Scenic byways, national parks, and hidden gems",
  },
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
        setTextVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      <div className="relative z-[3] flex h-full flex-col items-center justify-center px-4">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
          <span className="text-sm font-medium text-white tracking-wide">
            Colorado&apos;s Premier Car Rental
          </span>
        </div>

        <h1
          className="mb-3 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl transition-all duration-500"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {SLIDES[current].title}
        </h1>
        <p
          className="mx-auto mb-10 max-w-2xl text-center text-lg text-white/90 md:text-xl transition-all duration-500 delay-100"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {SLIDES[current].subtitle}
        </p>

        <div className="w-full max-w-4xl">
          <HeroSearch />
        </div>

        <div className="mt-8 flex gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setTextVisible(false);
                setTimeout(() => {
                  setCurrent(i);
                  setTextVisible(true);
                }, 300);
              }}
              className="group relative h-2.5 overflow-hidden rounded-full transition-all duration-300"
              style={{ width: i === current ? 32 : 10 }}
            >
              <span
                className="absolute inset-0 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    i === current ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
                }}
              />
              {i === current && (
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-white"
                  style={{
                    animation: "slideProgress 6s linear",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
