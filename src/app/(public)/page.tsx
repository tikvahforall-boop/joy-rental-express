export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Shield,
  CheckCircle,
  Headphones,
  Lock,
  Search,
  CalendarCheck,
  Car,
  Star,
  Mountain,
  MapPin,
} from "lucide-react";
import { APP_NAME, VEHICLE_CATEGORIES } from "@/lib/constants";
import { getFeaturedVehicles } from "@/lib/services/vehicle-service";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { Button } from "@/components/ui/button";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { ColoradoDestinations } from "@/components/home/colorado-destinations";
import { HomeFaq } from "./home-faq";

const TESTIMONIALS = [
  {
    name: "Jessica M.",
    location: "Denver, CO",
    rating: 5,
    text: "Rented an SUV for a weekend trip to Rocky Mountain National Park. Trail Ridge Road was incredible! Booking was seamless and the car handled mountain roads perfectly.",
    trip: "Rocky Mountain National Park",
  },
  {
    name: "Marcus T.",
    location: "Colorado Springs, CO",
    rating: 5,
    text: "Needed a 4WD for a ski trip to Vail. Great selection, fair prices, and the Denver airport pickup was super convenient. Way better than the big rental agencies.",
    trip: "Vail Ski Trip",
  },
  {
    name: "Priya R.",
    location: "Boulder, CO",
    rating: 5,
    text: "Found a convertible for a drive through the Maroon Bells area. The fall colors were stunning! Peak Drive Denver made the whole experience effortless.",
    trip: "Maroon Bells Scenic Drive",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Search",
    description:
      "Browse vehicles by location, dates, and type. Filter by features, price, and more to find your perfect match.",
  },
  {
    icon: CalendarCheck,
    title: "Book",
    description:
      "Reserve instantly with secure checkout. Flexible cancellation options and insurance coverage included.",
  },
  {
    icon: Car,
    title: "Drive",
    description:
      "Pick up from the host or get it delivered. Enjoy your trip with 24/7 roadside assistance.",
  },
];

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "Insurance Coverage",
    description: "Every trip includes liability coverage with optional premium protection plans.",
  },
  {
    icon: CheckCircle,
    title: "Verified Hosts",
    description: "All hosts are identity-verified with background checks and vehicle inspections.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is always available to help with any questions or roadside emergencies.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "All transactions are encrypted and processed through our secure payment system.",
  },
];

const ROAD_TRIPS = [
  {
    name: "Peak to Peak Scenic Byway",
    duration: "Half Day",
    distance: "55 miles",
  },
  {
    name: "Million Dollar Highway",
    duration: "Full Day",
    distance: "305 miles",
  },
  {
    name: "Trail Ridge Road",
    duration: "Half Day",
    distance: "48 miles",
  },
];

export default async function HomePage() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <main>
      <HeroSlideshow />

      {/* Browse by Category */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Browse by Category</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {VEHICLE_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/search?category=${cat.value}`}
                className="flex shrink-0 flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Colorado */}
      <section className="bg-gray-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center gap-2 text-neutral-600">
            <Mountain className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Explore Colorado
            </span>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
            Popular Destinations
          </h2>
          <p className="mb-8 max-w-xl text-gray-500">
            From the towering Rockies to the red desert canyons, find the perfect car for every Colorado adventure.
          </p>
          <ColoradoDestinations />
        </div>
      </section>

      {/* Popular Cars */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Popular Cars Near You</h2>
            <Link
              href="/search"
              className="text-sm font-medium text-neutral-800 hover:text-neutral-900"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Scenic Road Trips Banner */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative px-4 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <Car className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Scenic Drives</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Colorado&apos;s Best Road Trips
            </h2>
            <p className="mb-8 max-w-xl text-lg text-white/80">
              Hit the open road and experience the most breathtaking drives in America. Every route is an adventure.
            </p>
            <div className="flex flex-wrap gap-4">
              {ROAD_TRIPS.map((trip) => (
                <div
                  key={trip.name}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm"
                >
                  <p className="font-semibold text-white">{trip.name}</p>
                  <p className="mt-1 text-sm text-white/70">
                    {trip.duration} &middot; {trip.distance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
            How It Works
          </h2>
          <p className="mb-12 text-gray-500">
            Getting on the road is easy with {APP_NAME}
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-neutral-200 md:block" />
                )}
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-800">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-gray-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Trust & Safety
          </h2>
          <p className="mb-12 text-center text-gray-500">
            Your safety is our top priority
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-800">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            What Our Renters Say
          </h2>
          <p className="mb-12 text-center text-gray-500">
            Trusted by thousands of travelers across Colorado
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {testimonial.trip}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mb-10 text-center text-gray-500">
            Everything you need to know about renting with {APP_NAME}
          </p>
          <HomeFaq />
        </div>
      </section>

      {/* CTA with Colorado backdrop */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50" />
        <div className="relative px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Explore Colorado?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Find the perfect ride for your next mountain adventure. Book today and hit the open road.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/search">
                <Button
                  size="lg"
                  className="bg-white text-neutral-800 hover:bg-neutral-50"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Browse Cars
                </Button>
              </Link>
              <Link href="/book">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
