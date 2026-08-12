import { Search, CalendarCheck, Car, Shield, Star, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Peak Drive Denver",
  description: "Learn how to rent a car or list your vehicle on Peak Drive Denver.",
};

const renterSteps = [
  {
    icon: Search,
    title: "Search & Compare",
    description:
      "Browse hundreds of vehicles by location, dates, and preferences. Compare prices, features, and reviews to find your perfect ride.",
  },
  {
    icon: CalendarCheck,
    title: "Book & Pay",
    description:
      "Choose your dates, select optional protection and add-ons, and complete your booking securely. Get instant confirmation or quick host approval.",
  },
  {
    icon: Car,
    title: "Pick Up & Drive",
    description:
      "Meet your host at the pickup location or get the car delivered. Complete a quick check-in, and you're on your way.",
  },
];

const hostSteps = [
  {
    icon: Car,
    title: "List Your Vehicle",
    description:
      "Create your listing in minutes. Add photos, set your price, availability, and rules. Our team reviews and approves your listing.",
  },
  {
    icon: CalendarCheck,
    title: "Accept Bookings",
    description:
      "Get notified when someone wants to book. Accept or set up instant booking to automate the process. You're always in control.",
  },
  {
    icon: Star,
    title: "Earn Money",
    description:
      "Get paid after each trip. Track your earnings, manage your fleet, and grow your business on the platform.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-neutral-800 to-black text-white py-20">
        <div className="container-page text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
          <p className="text-lg text-neutral-100 max-w-2xl mx-auto">
            Whether you want to rent a car or earn money sharing yours, Joy
            Rental Express makes it simple, safe, and rewarding.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            For Renters
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {renterSteps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-neutral-800" />
                </div>
                <div className="text-sm font-medium text-neutral-800 mb-1">
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-neutral-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-neutral-900 transition-colors"
            >
              Find a Car
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            For Hosts
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {hostSteps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-neutral-600" />
                </div>
                <div className="text-sm font-medium text-neutral-600 mb-1">
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/become-a-host"
              className="inline-flex items-center gap-2 bg-neutral-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-neutral-600 transition-colors"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Peak Drive Denver?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="w-10 h-10 text-neutral-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Protection Available
              </h3>
              <p className="text-sm text-gray-600">
                Optional insurance and protection packages available for every
                trip, so you can drive with confidence.
              </p>
            </div>
            <div className="text-center">
              <Star className="w-10 h-10 text-neutral-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Verified Community
              </h3>
              <p className="text-sm text-gray-600">
                All hosts and vehicles are reviewed. Mutual reviews keep the
                community trusted and transparent.
              </p>
            </div>
            <div className="text-center">
              <HeadphonesIcon className="w-10 h-10 text-neutral-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-sm text-gray-600">
                Our support team is available around the clock to help with any
                questions or issues during your trip.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
