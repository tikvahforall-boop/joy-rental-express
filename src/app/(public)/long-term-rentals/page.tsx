"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  DollarSign,
  Shield,
  Clock,
  Building2,
  Users,
  Fuel,
  Gauge,
  Car,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  category: string;
  seats: number;
  transmission: string;
  fuelType: string;
  city?: string;
  state?: string;
  dailyPrice: number;
  weeklyPrice?: number;
  monthlyPrice?: number;
  imageUrl: string | null;
  features: string[];
}

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Save Up to 40%",
    description:
      "Long-term rates are significantly lower than daily pricing. The longer you rent, the more you save.",
  },
  {
    icon: Shield,
    title: "Insurance Included",
    description:
      "Comprehensive insurance coverage is included with all long-term rental plans at no extra cost.",
  },
  {
    icon: Clock,
    title: "Flexible Terms",
    description:
      "Choose weekly or monthly plans with the flexibility to extend or return early with reasonable notice.",
  },
  {
    icon: Building2,
    title: "Corporate Ready",
    description:
      "Perfect for businesses needing fleet vehicles, employee relocations, or project-based transportation.",
  },
];

const IDEAL_FOR = [
  "Business professionals on extended assignments",
  "Relocating families waiting for their vehicle",
  "Corporate fleets and project teams",
  "Seasonal workers and travel nurses",
  "Insurance replacement while your car is in the shop",
  "Extended Colorado vacations and road trips",
];

export default function LongTermRentalsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vehicles/programs?program=long-term")
      .then((res) => res.json())
      .then((data) => setVehicles(data.vehicles || []))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-700 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1449965408869-ebd13bc9e5c8?w=1920&q=80&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Long-Term Rentals</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Rent by the Week or Month
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Save big on extended rentals. Whether you need a car for a few weeks or several months, our long-term plans offer the best value in Denver.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#vehicles"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors"
            >
              View Available Cars
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Why Choose Long-Term?
          </h2>
          <p className="mb-12 text-center text-gray-500">
            More time, less cost — long-term rentals are the smart choice
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-800">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Ideal For
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {IDEAL_FOR.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vehicles" className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Available for Long-Term Rental
          </h2>
          <p className="mb-10 text-center text-gray-500">
            All vehicles below are available for weekly and monthly rentals
          </p>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-4 h-44 rounded-lg bg-gray-200" />
                  <div className="mb-2 h-5 w-2/3 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="py-16 text-center">
              <Car className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No long-term vehicles listed yet
              </h3>
              <p className="mb-6 text-gray-500">
                We&apos;re adding vehicles to our long-term fleet soon. Contact us for custom arrangements.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-800 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              vehicles.length === 1
                ? "grid-cols-1 max-w-md mx-auto"
                : vehicles.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}>
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="group rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl bg-gray-100">
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt={`${v.year} ${v.make} ${v.model}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-400 to-neutral-800">
                        <Car className="h-16 w-16 text-white/60" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                        Long-Term Available
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                      {v.year} {v.make} {v.model}
                    </h3>
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {v.seats} seats
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5" /> {v.transmission === "AUTOMATIC" ? "Auto" : "Manual"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5" /> {v.fuelType === "GASOLINE" ? "Gas" : v.fuelType.toLowerCase()}
                      </span>
                    </div>

                    <div className="mb-4 space-y-1 rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Daily</span>
                        <span className="font-medium text-gray-700">{formatCurrency(v.dailyPrice)}/day</span>
                      </div>
                      {v.weeklyPrice && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Weekly</span>
                          <span className="font-semibold text-green-600">{formatCurrency(v.weeklyPrice)}/week</span>
                        </div>
                      )}
                      {v.monthlyPrice && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Monthly</span>
                          <span className="font-semibold text-green-600">{formatCurrency(v.monthlyPrice)}/month</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href="/book"
                      className="block w-full rounded-lg bg-neutral-800 py-2.5 text-center text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
                    >
                      Book Long-Term
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-neutral-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Need a Custom Long-Term Plan?
          </h2>
          <p className="mb-8 text-white/70">
            We offer tailored rates for corporate accounts, fleet needs, and extended rentals beyond 6 months. Get in touch for a personalized quote.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            Request a Quote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
