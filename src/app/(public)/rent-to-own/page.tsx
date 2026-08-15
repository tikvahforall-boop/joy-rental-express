"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Car,
  DollarSign,
  TrendingUp,
  CreditCard,
  FileCheck,
  Users,
  Fuel,
  Gauge,
  CheckCircle,
  ArrowRight,
  Send,
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
  purchasePrice?: number;
  rtoDownPayment?: number;
  rtoMonthlyPayment?: number;
  rtoTermMonths?: number;
  imageUrl: string | null;
  features: string[];
}

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: FileCheck,
    title: "Apply",
    description: "Fill out a quick application. We'll review your information and get back to you within 24 hours.",
  },
  {
    step: 2,
    icon: Car,
    title: "Choose Your Car",
    description: "Browse our rent-to-own inventory and pick the vehicle that fits your needs and budget.",
  },
  {
    step: 3,
    icon: CreditCard,
    title: "Make Payments",
    description: "Pay a down payment and make fixed monthly payments. Your payments go toward owning the car.",
  },
  {
    step: 4,
    icon: TrendingUp,
    title: "Own It",
    description: "At the end of your term, the car is yours. Title transfer included at no extra cost.",
  },
];

const BENEFITS = [
  "No traditional credit check required",
  "Fixed monthly payments — no surprises",
  "Build toward vehicle ownership",
  "Maintenance support during your term",
  "Flexible down payment options",
  "Early buyout available at any time",
];

export default function RentToOwnPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    vehicleInterest: "",
    employmentStatus: "",
    monthlyIncome: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/vehicles/programs?program=rent-to-own")
      .then((res) => res.json())
      .then((data) => setVehicles(data.vehicles || []))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 to-neutral-900 text-white">
        <div className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1920&q=80&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Rent to Own</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Drive Now, Own Later
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Our rent-to-own program puts you in the driver&apos;s seat. Make affordable monthly payments and the car becomes yours. No traditional credit check needed.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#apply"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-green-900 hover:bg-green-50 transition-colors"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#vehicles"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View Cars
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            How Rent-to-Own Works
          </h2>
          <p className="mb-12 text-center text-gray-500">
            Four simple steps to vehicle ownership
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                {step.step < 4 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-green-200 md:block" />
                )}
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-800">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-800 text-xs font-bold text-white">
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Why Rent-to-Own?
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BENEFITS.map((item) => (
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
            Rent-to-Own Vehicles
          </h2>
          <p className="mb-10 text-center text-gray-500">
            These vehicles are available for our rent-to-own program
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
                No rent-to-own vehicles listed yet
              </h3>
              <p className="mb-6 text-gray-500">
                We&apos;re preparing vehicles for our rent-to-own program. Apply below and we&apos;ll notify you when cars are available.
              </p>
              <Link
                href="#apply"
                className="inline-flex items-center gap-2 rounded-xl bg-green-800 px-6 py-3 text-sm font-semibold text-white hover:bg-green-900 transition-colors"
              >
                Apply Now
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
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-400 to-green-800">
                        <Car className="h-16 w-16 text-white/60" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                        Rent to Own
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

                    <div className="mb-4 space-y-2 rounded-lg bg-green-50 p-3">
                      {v.purchasePrice && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Purchase Price</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(v.purchasePrice)}</span>
                        </div>
                      )}
                      {v.rtoDownPayment && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Down Payment</span>
                          <span className="font-medium text-gray-700">{formatCurrency(v.rtoDownPayment)}</span>
                        </div>
                      )}
                      {v.rtoMonthlyPayment && (
                        <div className="flex items-center justify-between text-sm border-t border-green-200 pt-2">
                          <span className="text-gray-600">Monthly Payment</span>
                          <span className="text-lg font-bold text-green-700">{formatCurrency(v.rtoMonthlyPayment)}/mo</span>
                        </div>
                      )}
                      {v.rtoTermMonths && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{v.rtoTermMonths}-month term</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href="#apply"
                      className="block w-full rounded-lg bg-green-800 py-2.5 text-center text-sm font-semibold text-white hover:bg-green-900 transition-colors"
                    >
                      Apply for This Car
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="apply" className="bg-gray-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Apply for Rent-to-Own
          </h2>
          <p className="mb-8 text-center text-gray-500">
            Fill out the form below and we&apos;ll get back to you within 24 hours
          </p>

          {submitted ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Application Received!
              </h3>
              <p className="text-gray-600">
                Thank you for your interest in our rent-to-own program. Our team will review your application and contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  />
                </div>
                <div>
                  <label htmlFor="vehicleInterest" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Vehicle of Interest
                  </label>
                  <input
                    id="vehicleInterest"
                    name="vehicleInterest"
                    type="text"
                    placeholder="e.g., 2019 Hyundai Elantra"
                    value={formData.vehicleInterest}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  />
                </div>
                <div>
                  <label htmlFor="employmentStatus" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Employment Status *
                  </label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    required
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  >
                    <option value="">Select...</option>
                    <option value="employed-full">Employed Full-Time</option>
                    <option value="employed-part">Employed Part-Time</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="contractor">Independent Contractor</option>
                    <option value="retired">Retired</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="monthlyIncome" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Monthly Income Range *
                  </label>
                  <select
                    id="monthlyIncome"
                    name="monthlyIncome"
                    required
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  >
                    <option value="">Select...</option>
                    <option value="under-2000">Under $2,000</option>
                    <option value="2000-3500">$2,000 - $3,500</option>
                    <option value="3500-5000">$3,500 - $5,000</option>
                    <option value="5000-7500">$5,000 - $7,500</option>
                    <option value="7500-plus">$7,500+</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us anything else that might help with your application..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                />
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900 transition-colors"
              >
                <Send className="h-4 w-4" />
                Submit Application
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                By submitting, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
