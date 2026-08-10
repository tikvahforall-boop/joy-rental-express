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
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
import { APP_NAME, VEHICLE_CATEGORIES } from "@/lib/constants";
import { getFeaturedVehicles } from "@/lib/services/vehicle-service";
import { HeroSearch } from "@/components/search/hero-search";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { Button } from "@/components/ui/button";
import { HomeFaq } from "./home-faq";

const TESTIMONIALS = [
  {
    name: "Jessica M.",
    location: "San Francisco, CA",
    rating: 5,
    text: "Rented a Tesla for a weekend trip down the coast. The booking process was seamless and the car was spotless. Will definitely use Joy Rental Express again!",
  },
  {
    name: "Marcus T.",
    location: "Austin, TX",
    rating: 5,
    text: "As a host, I've earned over $1,200 a month renting out my SUV when I'm not using it. The platform handles everything from insurance to payments.",
  },
  {
    name: "Priya R.",
    location: "New York, NY",
    rating: 5,
    text: "So much better than traditional rental agencies. Found a great car at half the price, and the host was incredibly helpful with local recommendations.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Search",
    description:
      "Browse thousands of vehicles by location, dates, and type. Filter by features, price, and more to find your perfect match.",
  },
  {
    icon: CalendarCheck,
    title: "Book",
    description:
      "Reserve instantly or send a booking request. Secure checkout with flexible cancellation options and insurance coverage.",
  },
  {
    icon: Car,
    title: "Drive",
    description:
      "Pick up from the host or get it delivered. Enjoy your trip with 24/7 roadside assistance and support.",
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

export default async function HomePage() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-900 px-4 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Find Your Perfect Ride
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-green-100 md:text-xl">
            Rent from trusted hosts or our own fleet. Cars available across the US.
          </p>
          <HeroSearch />
        </div>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Browse by Category</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {VEHICLE_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/search?category=${cat.value}`}
                className="flex shrink-0 flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition-all hover:border-green-300 hover:shadow-md"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Popular Cars Near You</h2>
            <Link
              href="/search"
              className="text-sm font-medium text-green-600 hover:text-green-700"
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
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-green-200 md:block" />
                )}
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
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

      <section className="bg-gradient-to-br from-amber-500 to-amber-600 px-4 py-16 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row">
          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Turn Your Car Into a Money Maker
            </h2>
            <p className="mb-6 text-lg text-amber-100">
              List your vehicle on {APP_NAME} and earn up to $1,200/month. We handle
              insurance, payments, and customer support so you can sit back and earn.
            </p>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 text-white">
                <DollarSign className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">Set your own price</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Shield className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">Insurance included</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <TrendingUp className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">Earn passively</span>
              </div>
            </div>
            <Link href="/become-a-host">
              <Button
                variant="outline"
                size="lg"
                className="border-white bg-white text-amber-600 hover:bg-amber-50 hover:text-amber-700"
              >
                Become a Host
              </Button>
            </Link>
          </div>
          <div className="flex h-48 w-48 items-center justify-center rounded-full bg-amber-400/30 md:h-64 md:w-64">
            <span className="text-7xl md:text-8xl">🚗</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
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
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
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

      <section className="bg-gray-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            What Our Community Says
          </h2>
          <p className="mb-12 text-center text-gray-500">
            Trusted by thousands of renters and hosts
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
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

      <section className="px-4 py-16 md:py-20">
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

      <section className="bg-green-600 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to Hit the Road?
          </h2>
          <p className="mb-8 text-lg text-green-100">
            Join thousands of happy renters and find your perfect ride today.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/search">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50"
              >
                <Search className="mr-2 h-4 w-4" />
                Browse Cars
              </Button>
            </Link>
            <Link href="/become-a-host">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-green-700"
              >
                <Clock className="mr-2 h-4 w-4" />
                List Your Car
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
