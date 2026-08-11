import {
  DollarSign,
  Calendar,
  Shield,
  TrendingUp,
  Clock,
  Users,
  Car,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Host | Mile High Car Rental",
  description:
    "Turn your car into a money maker. List your vehicle on Mile High Car Rental and earn extra income.",
};

const benefits = [
  {
    icon: DollarSign,
    title: "Earn Extra Income",
    description:
      "The average host earns $500+ per month. Premium vehicles can earn significantly more.",
  },
  {
    icon: Calendar,
    title: "Set Your Own Schedule",
    description:
      "You decide when your car is available. Block dates anytime for personal use.",
  },
  {
    icon: Shield,
    title: "Protection Available",
    description:
      "Optional protection packages cover liability and physical damage during rentals.",
  },
  {
    icon: TrendingUp,
    title: "Smart Pricing Tools",
    description:
      "Set daily, weekly, and monthly rates. Add discounts, seasonal pricing, and more.",
  },
  {
    icon: Clock,
    title: "Instant Booking Option",
    description:
      "Enable instant booking to accept reservations automatically with no effort required.",
  },
  {
    icon: Users,
    title: "Verified Renters",
    description:
      "All renters verify their identity and driver's license before they can book.",
  },
];

const requirements = [
  "Vehicle must be in good working condition",
  "Valid registration and insurance",
  "Vehicle must pass a safety inspection",
  "You must be the owner or authorized to list",
  "Minimum age of 21 to host",
  "Clean driving record",
];

export default function BecomeAHostPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-white py-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Turn Your Car Into a Money Maker
            </h1>
            <p className="text-xl text-neutral-100 mb-8">
              Join thousands of hosts earning extra income by sharing their
              vehicles on Mile High Car Rental. List for free and start earning.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register?role=HOST"
                className="bg-neutral-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-600 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/how-it-works"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How Hosting Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Listing your car is simple. Here's what to expect.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Create Account", desc: "Sign up as a host and verify your identity." },
              { step: "2", title: "List Your Car", desc: "Add photos, details, pricing, and availability." },
              { step: "3", title: "Get Approved", desc: "Our team reviews your listing within 24 hours." },
              { step: "4", title: "Start Earning", desc: "Accept bookings and get paid after each trip." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-neutral-800 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Host With Us?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white p-6 rounded-2xl shadow-sm">
                <b.icon className="w-8 h-8 text-neutral-800 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            What You Need to Get Started
          </h2>
          <div className="bg-neutral-50 rounded-2xl p-8">
            <div className="space-y-4">
              {requirements.map((req) => (
                <div key={req} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-neutral-800 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-neutral-800 to-black text-white">
        <div className="container-page text-center">
          <Car className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-neutral-100 mb-8 max-w-lg mx-auto">
            Join the Mile High Car Rental community today. Listing is free and
            takes less than 10 minutes.
          </p>
          <Link
            href="/register?role=HOST"
            className="inline-flex items-center gap-2 bg-neutral-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-600 transition-colors"
          >
            List Your Car
          </Link>
        </div>
      </section>
    </div>
  );
}
