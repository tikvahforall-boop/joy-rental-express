"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Car, CreditCard, Shield, Calendar, User, MessageCircle } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    icon: Car,
    title: "Renting a Car",
    faqs: [
      { q: "How do I book a vehicle?", a: "Search for vehicles by location and dates, select your vehicle, choose add-ons and protection, and complete payment. You'll receive a confirmation email with pickup instructions." },
      { q: "What do I need to rent?", a: "You need a valid driver's license, to be at least 21 years old (25 for some luxury vehicles), and a valid payment method. Some hosts may require additional verification." },
      { q: "Can I modify or cancel my booking?", a: "Yes, you can modify or cancel through your dashboard. Cancellation fees may apply depending on how close to the trip start date you cancel. Check the specific cancellation policy on the listing." },
      { q: "What happens if the car breaks down?", a: "Contact the host and our support team immediately. If you have Premium or Premium Plus protection, roadside assistance is included. We'll help arrange a replacement vehicle if needed." },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Pricing",
    faqs: [
      { q: "How is pricing calculated?", a: "Pricing includes the daily rate, any applicable fees (cleaning, delivery, airport), service fee, taxes, and optional protection. A full breakdown is shown before you confirm your booking." },
      { q: "When am I charged?", a: "You're charged when your booking is confirmed (instantly or upon host approval). A security deposit hold may also be placed and released after the trip." },
      { q: "How do refunds work?", a: "Refund amounts depend on the cancellation policy. Refunds are processed to your original payment method within 5-10 business days." },
    ],
  },
  {
    icon: Shield,
    title: "Protection & Insurance",
    faqs: [
      { q: "Do I need protection?", a: "We strongly recommend selecting a protection plan. While not always required, it provides peace of mind against accidents, theft, and other incidents during your trip." },
      { q: "What does protection cover?", a: "Coverage varies by tier. Basic covers liability only. Standard adds collision. Premium includes comprehensive and roadside assistance. Premium Plus adds zero deductible. See our Protection page for full details." },
      { q: "How do I file a claim?", a: "Report any damage or incident through your booking dashboard. Provide photos, a description, and any relevant details. Our claims team will guide you through the process." },
    ],
  },
  {
    icon: User,
    title: "Account & Verification",
    faqs: [
      { q: "How do I verify my identity?", a: "Go to your profile settings and upload a photo of your government-issued ID. Verification is typically reviewed within 24 hours." },
      { q: "How do I upload my driver's license?", a: "Navigate to Profile > Driver's License in your dashboard. Upload clear photos of the front and back of your license." },
      { q: "Can I have both a renter and host account?", a: "Each account has a single role, but you can switch roles by contacting support if you want to both rent and host." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-gray-600 text-sm leading-relaxed animate-fade-in">
          {a}
        </p>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (faq) =>
          !searchQuery ||
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.faqs.length > 0);

  return (
    <div>
      <section className="bg-gradient-to-br from-neutral-800 to-black text-white py-16">
        <div className="container-page text-center">
          <h1 className="text-4xl font-bold mb-6">Help Center</h1>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 border-0 focus:ring-2 focus:ring-neutral-300 outline-none"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page max-w-3xl">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No results found. Try a different search or{" "}
                <Link href="/contact" className="text-neutral-800 hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredCategories.map((cat) => (
                <div key={cat.title}>
                  <div className="flex items-center gap-3 mb-4">
                    <cat.icon className="w-6 h-6 text-neutral-800" />
                    <h2 className="text-xl font-bold text-gray-900">
                      {cat.title}
                    </h2>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl px-6">
                    {cat.faqs.map((faq) => (
                      <FAQItem key={faq.q} {...faq} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-neutral-50 rounded-2xl p-8 text-center">
            <MessageCircle className="w-10 h-10 text-neutral-800 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Still need help?
            </h3>
            <p className="text-gray-600 mb-4">
              Our support team is ready to assist you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-neutral-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-900 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
