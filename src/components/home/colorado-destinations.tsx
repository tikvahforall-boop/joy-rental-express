"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

const DESTINATIONS = [
  {
    name: "Denver",
    tagline: "Start your adventure in the Mile High City",
    image:
      "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=800&q=80&auto=format&fit=crop",
    link: "/search?location=Denver",
  },
  {
    name: "Colorado Springs",
    tagline: "Garden of the Gods & Pikes Peak",
    image:
      "https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?w=800&q=80&auto=format&fit=crop",
    link: "/search?location=Colorado+Springs",
  },
  {
    name: "Aspen",
    tagline: "World-class skiing & mountain luxury",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80&auto=format&fit=crop",
    link: "/search?location=Aspen",
  },
  {
    name: "Rocky Mountain National Park",
    tagline: "Trail Ridge Road & alpine wilderness",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80&auto=format&fit=crop",
    link: "/search?location=Estes+Park",
  },
  {
    name: "Vail",
    tagline: "Year-round mountain paradise",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80&auto=format&fit=crop",
    link: "/search?location=Vail",
  },
  {
    name: "Great Sand Dunes",
    tagline: "North America's tallest sand dunes",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80&auto=format&fit=crop",
    link: "/search?location=Great+Sand+Dunes",
  },
];

export function ColoradoDestinations() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {DESTINATIONS.map((dest, i) => (
        <Link
          key={dest.name}
          href={dest.link}
          className={`group relative overflow-hidden rounded-2xl ${
            i === 0 || i === 3 ? "sm:col-span-2 lg:col-span-1 h-72" : "h-64"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${dest.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
          <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300 group-hover:translate-y-[-4px]">
            <div className="mb-1.5 flex items-center gap-1.5 text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {dest.name}
              </span>
            </div>
            <p className="text-sm text-white/70">{dest.tagline}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
